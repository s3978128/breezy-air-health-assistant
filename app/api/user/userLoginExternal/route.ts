import { createUser } from '@/utils/users-data'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { name, email, provider } = await req.json()

    await createUser({
      name,
      email,
      provider,
    })

    return NextResponse.json({ message: 'External account...' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'External account error:' }, { status: 500 })
  }
}
