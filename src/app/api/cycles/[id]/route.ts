import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import * as db from '@/lib/db'

// PUT /api/cycles/[id] - Update cycle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const cycleId = Number(id)
    const body = await request.json()
    const { startDate, endDate, painLevel, symptoms, notes } = body

    // Validate pain level if provided
    if (painLevel !== undefined && (painLevel < 1 || painLevel > 5)) {
      return NextResponse.json(
        { error: 'painLevel must be between 1 and 5' },
        { status: 400 }
      )
    }

    const success = await db.updateCycle(cycleId, Number(session.user.id), {
      startDate,
      endDate,
      painLevel,
      symptoms,
      notes,
    })

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update cycle or cycle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Cycle updated successfully',
    })
  } catch (error) {
    console.error('Error updating cycle:', error)
    return NextResponse.json(
      { error: 'Failed to update cycle' },
      { status: 500 }
    )
  }
}

// DELETE /api/cycles/[id] - Delete cycle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const cycleId = Number(id)

    const success = await db.deleteCycle(cycleId, Number(session.user.id))

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete cycle or cycle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Cycle deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting cycle:', error)
    return NextResponse.json(
      { error: 'Failed to delete cycle' },
      { status: 500 }
    )
  }
}
