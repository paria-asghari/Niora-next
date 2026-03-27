import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest) {
  try {
    const { sessionIds } = await req.json()

    if (!sessionIds || !Array.isArray(sessionIds)) {
      return NextResponse.json(
        { error: "Invalid session IDs" },
        { status: 400 }
      )
    }

    // Delete sessions in parallel
    const deletePromises = sessionIds.map(async (sessionId: number) => {
      try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/sessions/${sessionId}`, {
          method: "DELETE",
        })
        return { sessionId, success: response.ok }
      } catch (error) {
        console.error(`Error deleting session ${sessionId}:`, error)
        return { sessionId, success: false }
      }
    })

    const results = await Promise.all(deletePromises)
    const successCount = results.filter(r => r.success).length
    const failureCount = results.length - successCount

    return NextResponse.json({
      message: `Successfully deleted ${successCount} sessions${failureCount > 0 ? ` (${failureCount} failed)` : ''}`,
      results
    })
  } catch (error) {
    console.error("Bulk delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
