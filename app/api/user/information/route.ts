import { auth } from '@/auth'
import { updateInformation } from '@/utils/users-data'
import { NextResponse } from 'next/server'

export async function PUT(req) {
  const session = await auth()

  if (!session?.user) return NextResponse.json({ message: 'Unauthorized user.' }, { status: 500 })
  try {
    const id = session?.user?.id as string
    const { name, password } = await req.json()

    await updateInformation(id, { name, password })

    return NextResponse.json({ message: 'Personal Information updated' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Personal Information updated error:' }, { status: 500 })
  }
}
