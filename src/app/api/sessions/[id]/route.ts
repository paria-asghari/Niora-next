import { auth } from "@/auth"
import { deleteSession, getSessionMessages, getSessionById, getUserSessions } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { id } = await params
  const sessionId = parseInt(id)
  const userId = parseInt(session.user.id)

  // Get session info
  const sessionData = await getSessionById(sessionId, userId)
  if (!sessionData) {
    return new Response("Session not found", { status: 404 })
  }

  // Get session messages
  const messages = await getSessionMessages(sessionId, userId)

  // Get all sessions to find the title
  const allSessions = await getUserSessions(userId)
  const currentSession = allSessions.find(s => s.id === sessionId)

  return Response.json({ 
    session: {
      ...sessionData,
      title: currentSession?.title || 'چت بدون عنوان'
    }, 
    messages 
  })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { id } = await params
  const sessionId = parseInt(id)
  const userId = parseInt(session.user.id)

  const success = await deleteSession(sessionId, userId)

  if (!success) {
    return Response.json({ error: "سشن یافت نشد یا متعلق به شما نیست" }, { status: 404 })
  }

  return Response.json({ success: true, message: "سشن با موفقیت حذف شد" })
}
