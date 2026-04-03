import { NextRequest, NextResponse } from 'next/server'
import { DealModel } from '@/lib/models'
import { getUserFromToken } from '@/lib/auth'

// GET /api/deals - Get all deals or search/filter
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const nearby = searchParams.get('nearby')
    const lat = nearby ? searchParams.get('lat') : null
    const lng = nearby ? searchParams.get('lng') : null

    let deals

    if (query) {
      deals = await DealModel.search(query)
    } else if (category && category !== 'All') {
      deals = await DealModel.findByCategory(category)
    } else if (nearby && lat && lng) {
      deals = await DealModel.findNearby(parseFloat(lat), parseFloat(lng))
    } else {
      deals = await DealModel.findAll()
    }

    // Convert _id to string for JSON serialization
    const serializedDeals = deals.map(deal => ({
      ...deal,
      _id: deal._id!.toString(),
      id: deal._id!.toString(),
    }))

    return NextResponse.json({
      success: true,
      deals: serializedDeals,
    })
  } catch (error) {
    console.error('Get deals error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

// POST /api/deals - Create a new deal (admin only)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin check
    // const user = getUserFromToken(token)
    // if (!user || !user.isAdmin) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    const body = await request.json()
    const {
      title,
      description,
      discount,
      originalPrice,
      discountedPrice,
      storeName,
      image,
      category,
      location,
      expiresAt,
      terms,
    } = body

    // Validate required fields
    if (!title || !originalPrice || !discountedPrice || !storeName || !category || !expiresAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await DealModel.create({
      title,
      description: description || '',
      discount,
      originalPrice,
      discountedPrice,
      storeName,
      image: image || '',
      category,
      location,
      expiresAt: new Date(expiresAt),
      terms,
      isActive: true,
    })

    return NextResponse.json({
      success: true,
      message: 'Deal created successfully',
    })
  } catch (error) {
    console.error('Create deal error:', error)
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}
