import { getUsersWithDailyNotifications } from '@/utils/users-data'

export async function POST(req) {
  const { message } = await req.json()
  try {
    const users = await getUsersWithDailyNotifications()

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

    return new Response('Daily emails sent.', { status: 200 })
  } catch (error) {
    console.error('Daily email error:', error)
    return new Response('Failed to send daily emails', { status: 500 })
  }
}
