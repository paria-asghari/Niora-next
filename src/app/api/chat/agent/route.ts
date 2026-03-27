import { auth } from "@/auth"
import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { createSession, saveMessage, getUserIssues, createIssue, updateIssueStatus, getSessionById } from "@/lib/db"
import { extractIssues, checkIssueResolution } from "@/lib/openrouter"

// Configure OpenRouter as an OpenAI-compatible provider
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!
})

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { message, sessionId } = await req.json()

  if (!message) {
    return new Response("Message is required", { status: 400 })
  }

  const userId = parseInt(session.user.id)

  // Validate and get session ID
  let currentSessionId: number
  if (sessionId) {
    try {
      // Check if the provided session exists and belongs to the user
      const existingSession = await getSessionById(sessionId, userId)
      if (existingSession) {
        currentSessionId = sessionId
        console.log(`Using existing session: ${sessionId}`)
      } else {
        // Session doesn't exist or doesn't belong to user, create new one
        currentSessionId = await createSession(userId)
        console.log(`Session ${sessionId} not found, created new session: ${currentSessionId}`)
      }
    } catch (error) {
      console.error(`Error validating session ${sessionId}:`, error)
      // Create new session on any error
      currentSessionId = await createSession(userId)
      console.log(`Created new session due to error: ${currentSessionId}`)
    }
  } else {
    // Create new session
    currentSessionId = await createSession(userId)
    console.log(`Created new session: ${currentSessionId}`)
  }

  // Save user message
  await saveMessage(currentSessionId, userId, message, true)

  // Extract issues
  const newIssues = await extractIssues(message)
  for (const issue of newIssues) {
    const existing = await getUserIssues(userId)
    const isDuplicate = existing.some(e =>
      issue.title.toLowerCase().includes(e.title.toLowerCase()) ||
      e.title.toLowerCase().includes(issue.title.toLowerCase())
    )

    if (!isDuplicate) {
      await createIssue(userId, issue.title, issue.description)
    } else {
      await updateIssueStatus(existing[0].id, "open")
    }
  }

  // Check issue resolutions
  const openIssues = await getUserIssues(userId, "open")
  const issueUpdates = await checkIssueResolution(message, openIssues)

  for (const issue of openIssues) {
    if (issue.title in issueUpdates) {
      await updateIssueStatus(issue.id, issueUpdates[issue.title].status)
    }
  }

  // Stream response
  const result = streamText({
    model: openrouter("google/gemma-3-27b-it"),
    system: `You are an empathetic AI therapist assistant named Niora.

IMPORTANT - First, determine the user's intent:
1. If user is just greeting (like "سلام", "خوبی", etc.) - respond warmly and briefly
2. If user is sharing a problem - provide empathetic support and practical solutions

For GREETINGS (like "سلام"):
- Keep it short and warm (1-2 sentences)
- Example: "سلام عزیزم! ❤️ خوشحالم که اینجویی. چطور می‌تونم کمکت کنم؟"

For PROBLEMS:
- Start with brief, genuine empathy (1-2 sentences max)
- Then provide 2-3 practical, actionable solutions
- Keep total response under 6 sentences
- Be supportive but not overly emotional

Guidelines:
- Respond in Persian
- Match your response to what the user said
- Don't give solutions for greetings
- Be direct and solution-oriented`,
    prompt: message,
    temperature: 0.7,
    maxTokens: 400,
    onFinish: async ({ text }) => {
      // Save AI response after streaming completes
      await saveMessage(currentSessionId, userId, text, false)
    }
  })

  return result.toDataStreamResponse()
}
