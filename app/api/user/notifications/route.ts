import { auth } from '@/auth'
import { getUserById, updateNotifications } from '@/utils/users-data'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()

  if (!session?.user) return NextResponse.json({ message: 'Unauthorized user.' }, { status: 500 })
  try {
    const id = session?.user?.id as string
    const user = await getUserById(id)
    const notificationSettings = user?.notificationSettings

    if (user) return NextResponse.json({ notificationSettings })
    return NextResponse.json({ message: 'User is not found' }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ message: 'Get user preferences error.' }, { status: 500 })
  }
}

export async function PUT(req) {
  const session = await auth()

  if (!session?.user) return NextResponse.json({ message: 'Unauthorized user.' }, { status: 500 })

  try {
    const id = session?.user?.id as string
    const { notificationSettings } = await req.json()

    await updateNotifications(id, notificationSettings)

    return NextResponse.json({ message: 'Notification settings updated' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Notification settings updated error:' }, { status: 500 })
  }
}
