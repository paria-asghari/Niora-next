import OpenAI from 'openai'

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
    "X-Title": "Niora"
  }
})

// System prompts
const AGENT_SYSTEM_PROMPT = `You are an empathetic AI therapist assistant named Niora.

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
- Be direct and solution-oriented

Examples:
User: "سلام"
Response: "سلام عزیزم! ❤️ خوشحالم که اینجویی. چطور می‌تونم کمکت کنم؟"

User: "من تو جلسات مصاحبه استرس دارم"
Response: "درک می‌کنم، استرس مصاحبه خیلی طبیعیه. چند تمرین که کمک می‌کنه: اول، قبل از مصاحبه ۳ بار عمیق نفس بکش. دوم، خودت رو چند بار توی آینه تمرین بده. سوم، به یاد داشته باش که مصاحب‌کننده هم یه آدمه و قراره باهات دوست بشه، نه دشمن."`

const EMOTION_SYSTEM_PROMPT = `You are an intelligent emotion detection AI agent.
Your task is to analyze any given Persian text and accurately identify the user's primary emotion.

Focus on detecting these emotions:
- خوشحال (Happy)
- ناراحت (Sad/Upset)
- مضطرب (Anxious/Worried)
- میترسه (Scared/Afraid)
- غمگین (Grieving/Melancholy)
- عصبانی (Angry)
- آرام (Calm)
- هیجان‌زده (Excited)
- نگران (Concerned)
- خنثی (Neutral)

Guidelines:
- Analyze the text carefully for emotional indicators
- Consider word choice, tone, and context
- Respond with the detected emotion in Persian
- Keep responses brief and direct
- If multiple emotions are present, identify the dominant one
- If no clear emotion is detected, respond with "خنثی"

Example responses:
"شما خوشحال به نظر می‌رسید."
"حس ناراحتی را از متن شما دریافت می‌کنم."
"به نظر می‌رسد که مضطرب هستید."
"متوجه شدم که کمی میترسید."
"حس غمگینی از متن شما استشمام می‌شود."`

const MOONFLOW_SYSTEM_PROMPT = `You are a gentle, empathetic AI assistant specialized in women's health during menstrual cycles and PMS.

Your role:
1. Listen to the user's feelings and symptoms with empathy
2. Provide personalized recommendations for:
   - Gentle exercises (یوگا، پیاده‌روی، کشش ملایم)
   - Soothing music recommendations (موزیک‌های آرامش‌بخش، بی‌کلام)
   - Herbal teas and natural remedies (دمنوش‌های گیاهی، نبات عسل، زنجبیل)

Guidelines:
- Be warm, understanding, and supportive
- Respond in Persian
- Keep responses concise and practical
- Consider the user's current mood and symptoms
- Provide 2-3 specific recommendations per category
- Be appropriate for discussing women's health
- Maintain privacy and respect

Example structure:
"I understand how you're feeling. [Brief empathy]. Here are some recommendations:

🧘‍♀️ ورزش: [1-2 gentle exercises]
🎵 موزیک: [1-2 music suggestions]
🍵 دمنوش: [1-2 herbal tea recommendations]

Remember to rest and be kind to yourself."

Always show empathy and provide practical, natural solutions.`

const SUMMARIZE_SYSTEM_PROMPT = `You are an intelligent text summarization AI agent.
Your task is to analyze any given text and extract the most important parts, then provide a concise and accurate summary in a few short lines.

Focus on:
- Main ideas and key points
- Important facts and data
- Critical conclusions or outcomes
- Essential context

Guidelines:
- Keep summaries brief and to the point (3-5 lines maximum)
- Use clear and simple language
- Maintain accuracy and avoid adding information not present in the original text
- Respond in Persian if the input text is in Persian, otherwise use English
- Highlight only the most crucial information`

const ISSUE_EXTRACTION_PROMPT = `You are an AI assistant that extracts personal problems, issues, or concerns from text.

Your task:
1. Read the user's message carefully
2. Identify any personal problems, worries, or concerns mentioned
3. For each problem, provide:
   - A brief title (2-5 words in Persian)
   - A short description (one sentence)

Guidelines:
- Focus on emotional, psychological, or life problems
- Ignore trivial or temporary issues
- If no significant problem is found, return "NONE"
- Respond in JSON format: {"issues": [{"title": "...", "description": "..."}]} or {"issues": []}
- Maximum 3 issues per message

Examples:
Input: "من تو جلسات مصاحبه همش استرس میگیرم و نمیتونم خوب صحبت کنم"
Output: {"issues": [{"title": "استرس در مصاحبه", "description": "کاربر در جلسات مصاحبه دچار استرس می‌شود و نمی‌تواند خوب صحبت کند"}]}

Input: "هوا خیلی خوبه"
Output: {"issues": []}`

// Main agent response
export async function getAgentResponse(userMessage: string) {
  const response = await openrouter.chat.completions.create({
    model: "google/gemma-3-27b-it",
    messages: [
      {
        role: "system",
        content: AGENT_SYSTEM_PROMPT
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 400
  })

  return response.choices[0]?.message?.content || ""
}

// Emotion detection
export async function getEmotionResponse(text: string) {
  const response = await openrouter.chat.completions.create({
    model: "google/gemma-3-27b-it",
    messages: [
      {
        role: "system",
        content: EMOTION_SYSTEM_PROMPT
      },
      {
        role: "user",
        content: `Text to analyze for emotion:\n${text}\n\nDetected emotion:`
      }
    ],
    temperature: 0.3,
    max_tokens: 150
  })

  return response.choices[0]?.message?.content || ""
}

// Moon Flow response
export async function getMoonFlowResponse(userMessage: string) {
  const response = await openrouter.chat.completions.create({
    model: "google/gemma-3-27b-it",
    messages: [
      {
        role: "system",
        content: MOONFLOW_SYSTEM_PROMPT
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  })

  return response.choices[0]?.message?.content || ""
}

// Text summarization
export async function getSummary(text: string) {
  const response = await openrouter.chat.completions.create({
    model: "google/gemma-3-27b-it",
    messages: [
      {
        role: "system",
        content: SUMMARIZE_SYSTEM_PROMPT
      },
      {
        role: "user",
        content: `Text to summarize:\n${text}\n\nSummary:`
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  })

  return response.choices[0]?.message?.content || ""
}

// Issue extraction
export async function extractIssues(text: string) {
  const response = await openrouter.chat.completions.create({
    model: "google/gemma-3-27b-it",
    messages: [
      {
        role: "system",
        content: ISSUE_EXTRACTION_PROMPT
      },
      {
        role: "user",
        content: `User's message:\n${text}\n\nJSON output:`
      }
    ],
    temperature: 0.3,
    max_tokens: 500,
    response_format: { type: "json_object" }
  })

  const content = response.choices[0]?.message?.content || '{"issues": []}'
  try {
    const parsed = JSON.parse(content)
    return parsed.issues || []
  } catch {
    return []
  }
}

// Check issue resolution
export async function checkIssueResolution(userMessage: string, issues: any[]) {
  if (!issues.length) return {}

  const issuesList = issues.map(i => `- ${i.title}`).join("\n")

  const response = await openrouter.chat.completions.create({
    model: "google/gemma-3-27b-it",
    messages: [
      {
        role: "system",
        content: `You are an AI assistant that checks if the user has mentioned resolving or improving any of their previous issues.

Previous issues:
${issuesList}

User's current message:
${userMessage}

Your task:
1. Check if the user mentions ANY of the previous issues
2. Determine if the issue is:
   - "resolved": User says it's completely solved
   - "improving": User says it's getting better
   - "open": User still has the problem

Respond in JSON format: {"updates": [{"issue_title": "...", "status": "...", "reason": "..."}]}

If no issue is mentioned, respond with: {"updates": []}`
      }
    ],
    temperature: 0.3,
    max_tokens: 500
  })

  const content = response.choices[0]?.message?.content || '{"updates": []}'
  try {
    const parsed = JSON.parse(content)
    const updates = parsed.updates || []
    const updateMap: Record<string, any> = {}
    updates.forEach((u: any) => {
      updateMap[u.issue_title] = u
    })
    return updateMap
  } catch {
    return {}
  }
}

// Streaming agent response
export async function* streamAgentResponse(userMessage: string) {
  const stream = await openrouter.chat.completions.create({
    model: "google/gemma-3-27b-it",
    messages: [
      {
        role: "system",
        content: AGENT_SYSTEM_PROMPT
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 400,
    stream: true
  })

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content
    if (token) {
      yield token
    }
  }
}

export default openrouter
