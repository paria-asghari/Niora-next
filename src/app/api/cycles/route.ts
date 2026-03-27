import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import * as db from '@/lib/db'

// GET /api/cycles - Retrieve all cycles for authenticated user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cycles = await db.getUserCycles(Number(session.user.id))
    return NextResponse.json({ cycles })
  } catch (error) {
    console.error('Error fetching cycles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cycles' },
      { status: 500 }
    )
  }
}

// POST /api/cycles - Create new cycle entry
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { startDate, endDate, painLevel, symptoms, notes } = body

    // Validate required fields
    if (!startDate) {
      return NextResponse.json(
        { error: 'startDate is required' },
        { status: 400 }
      )
    }

    if (painLevel !== undefined && (painLevel < 1 || painLevel > 5)) {
      return NextResponse.json(
        { error: 'painLevel must be between 1 and 5' },
        { status: 400 }
      )
    }

    const result = await db.createCycle(
      Number(session.user.id),
      startDate,
      endDate || null,
      painLevel || 3,
      symptoms || null,
      notes || null
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to create cycle' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Cycle logged successfully',
    })
  } catch (error) {
    console.error('Error creating cycle:', error)
    return NextResponse.json(
      { error: 'Failed to create cycle' },
      { status: 500 }
    )
  }
}
