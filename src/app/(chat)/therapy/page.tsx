import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ChatContainer } from "@/components/chat/ChatContainer"

export default async function TherapyPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen">
      <ChatContainer />
    </div>
  )
}
