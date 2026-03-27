import { auth } from "@/auth"
import { getUserIssues } from "@/lib/db"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return Response.json({ follow_up: "", issues_count: 0 })
  }

  const userId = parseInt(session.user.id)
  const openIssues = await getUserIssues(userId, "open")

  let followUp = ""
  if (openIssues.length > 0) {
    const issue = openIssues[0]
    followUp = `یادمه دفعه قبل گفتی ${issue.title}. الان چطوره؟ هنوزم این چالش رو داری یا تا حدی بهبود پیدا کرده؟`
  }

  return Response.json({ follow_up: followUp, issues_count: openIssues.length })
}
