import { getUserById } from '@/utils/users-data'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserById(params.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('API getUser error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
