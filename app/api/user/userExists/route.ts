import { getUserByEmailAndProvider } from '@/utils/users-data'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { email, provider } = await req.json()
    const user = await getUserByEmailAndProvider(email, provider)
    return NextResponse.json({ user })
  } catch (error) {
    console.log('(api)userExists:', error)
  }
}
