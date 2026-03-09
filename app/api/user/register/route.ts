import { createUser } from '@/utils/users-data'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    await createUser({
      name,
      email,
      password,
      provider: 'credentials',
    })

    return NextResponse.json({ message: 'Register...' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Register error', error: error.message }, { status: 500 })
  }
}
