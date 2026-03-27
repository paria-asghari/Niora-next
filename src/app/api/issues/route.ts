import { auth } from "@/auth"
import { getUserIssues } from "@/lib/db"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") || undefined

  const userId = parseInt(session.user.id)
  const issues = await getUserIssues(userId, status)

  return Response.json({ issues })
}
