import { getUsersWithHourlyNotifications } from '@/utils/users-data'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { message } = await req.json()
  try {
    const users = await getUsersWithHourlyNotifications()

    await Promise.all(
      users.map(async (user) => {
        await fetch(`${process.env.AUTH_URL}/api/email/sendAirQuality`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.notificationSettings.email,
            loc: user.notificationSettings.location,
            alertThreshold: user.notificationSettings.alertThreshold,
            message,
          }),
        })
      }),
    )

    return NextResponse.json('Hourly emails sent.', { status: 200 })
  } catch (error) {
    console.error('Hourly email error:', error)
    return NextResponse.json('Failed to send hourly emails', { status: 500 })
  }
}
