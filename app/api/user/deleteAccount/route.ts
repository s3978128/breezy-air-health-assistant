import { auth } from '@/auth'
import { deleteUser } from '@/utils/users-data'
import { NextResponse } from 'next/server'

export async function DELETE() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized user.' }, { status: 401 })
  }

  try {
    await deleteUser(session.user.id as string)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
