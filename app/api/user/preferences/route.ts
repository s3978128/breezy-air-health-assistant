import { auth } from '@/auth'
import { getUserById, updatePreferences } from '@/utils/users-data'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()

  if (!session?.user) return NextResponse.json({ message: 'Unauthorized user.' }, { status: 500 })
  try {
    const id = session?.user?.id as string
    const user = await getUserById(id)
    const preferences = user?.preferences
    if (user) return NextResponse.json({ preferences })
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
    const { preferences } = await req.json()

    await updatePreferences(id, preferences)

    return NextResponse.json({ message: 'Preferences updated' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Preferences updated error:' }, { status: 500 })
  }
}
