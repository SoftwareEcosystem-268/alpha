import { NextRequest, NextResponse } from 'next/server'
import { DealModel, RedemptionModel } from '@/lib/models'
import { getUserFromToken } from '@/lib/auth'
import { ObjectId } from 'mongodb'

// GET /api/deals/[id] - Get a single deal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deal = await DealModel.findById(params.id)

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      deal: {
        ...deal,
        _id: deal._id!.toString(),
        id: deal._id!.toString(),
      },
    })
  } catch (error) {
    console.error('Get deal error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    )
  }
}

// POST /api/deals/[id]/redeem - Redeem a deal
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const deal = await DealModel.findById(params.id)
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    // Create redemption record
    const savings = deal.originalPrice - deal.discountedPrice
    await RedemptionModel.create({
      userId: new ObjectId(user.userId),
      dealId: deal._id!.toString(),
      dealTitle: deal.title,
      storeName: deal.storeName,
      savings,
      redeemedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: 'Deal redeemed successfully',
      savings,
    })
  } catch (error) {
    console.error('Redeem deal error:', error)
    return NextResponse.json(
      { error: 'Failed to redeem deal' },
      { status: 500 }
    )
  }
}
