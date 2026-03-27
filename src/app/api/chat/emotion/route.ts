import { auth } from "@/auth"
import { getEmotionResponse } from "@/lib/openrouter"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { message } = await req.json()

  if (!message) {
    return new Response("Message is required", { status: 400 })
  }

  const response = await getEmotionResponse(message)

  return Response.json({ response })
}
