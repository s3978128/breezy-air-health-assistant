import { NextResponse } from 'next/server'
import { auth } from '@/auth' // or your auth config path

export async function POST(request: Request) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { email, location, threshold, frequency } = await request.json()

    // Validate required fields
    if (!email || !location) {
      return NextResponse.json({ error: 'Email and location are required' }, { status: 400 })
    }

    // In a real app, this would store the subscription in a database
    // and set up the notification system

    console.log('Alert subscription created:', {
      email,
      location,
      threshold: threshold || 100,
      frequency: frequency || 'daily',
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to air quality alerts',
    })
  } catch (error) {
    console.error('Error creating alert subscription:', error)
    return NextResponse.json({ error: 'Failed to create alert subscription' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')

    if (!location) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 })
    }

    // In a real app, this would remove the subscription from a database

    console.log('Alert subscription deleted for location:', location)

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from air quality alerts',
    })
  } catch (error) {
    console.error('Error deleting alert subscription:', error)
    return NextResponse.json({ error: 'Failed to delete alert subscription' }, { status: 500 })
  }
}
