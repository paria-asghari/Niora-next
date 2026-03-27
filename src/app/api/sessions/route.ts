import { auth } from "@/auth"
import { getUserSessions, createSession } from "@/lib/db"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const userId = parseInt(session.user.id)
  const sessions = await getUserSessions(userId)

  return Response.json({ sessions })
}

export async function POST() {
  const session = await auth()

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const userId = parseInt(session.user.id)
  const sessionId = await createSession(userId)

  return Response.json({ session_id: sessionId })
}
