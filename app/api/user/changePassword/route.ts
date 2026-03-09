import { updatePassword } from '@/utils/users-data'
import { NextResponse } from 'next/server'

export async function PUT(req) {
  try {
    const {
      email,
      password,
      code,
      verification: { uuid, expires },
    } = await req.json()

    if (code === uuid && expires > Date.now()) {
      await updatePassword(email, password)
      return NextResponse.json({ message: 'New password updated' }, { status: 200 })
    }
    return NextResponse.json({ message: 'Invalid code' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ message: 'New password updated error:' + error }, { status: 500 })
  }
}
