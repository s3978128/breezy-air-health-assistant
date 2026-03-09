import { EmailTemplate } from '@/components/email/email-air-quality-template'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { auth } from '@/auth'
import {
  getUserById,
  getUsersWithDailyNotifications,
  getUsersWithHourlyNotifications,
} from '@/utils/users-data'
import { User } from '@/lib/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { message } = await req.json()

  if (!message) {
    return NextResponse.json({ success: false, error: 'Missing message' }, { status: 400 })
  }

  let users: User[] = []
  let singleUser = null

  switch (message) {
    case 'immediately':
      const session = await auth()

      if (!session?.user)
        return NextResponse.json({ message: 'Unauthorized user.' }, { status: 401 })

      singleUser = await getUserById(session.user.id as string)
      break

    case 'hourly':
      users = await getUsersWithHourlyNotifications()
      break

    case 'daily':
      users = await getUsersWithDailyNotifications()
      break

    default:
      return NextResponse.json({ success: false, error: 'Invalid message' }, { status: 400 })
  }

  // Handle the 'immediately' case
  if (singleUser) {
    users = [singleUser]
  }

  for (const user of users) {
    const { email, location, alertThreshold } = user.notificationSettings

    if (!email || !location || alertThreshold === undefined) continue

    const apiUrl = `${process.env.AUTH_URL}/api/air-quality?location=${encodeURIComponent(location)}`
    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.error(`Failed to fetch AQI for ${location}`)
      continue
    }

    const airQualityData = await response.json()

    if (alertThreshold <= airQualityData.aqi) {
      const {
        aqi,
        category,
        openWeatherAQI,
        healthImplications,
        cautionaryStatement,
        pollutants: { pm25, pm10, o3, no2, so2, co },
        timestamp,
      } = airQualityData

      const formattedTime = new Date(timestamp).toLocaleTimeString()

      try {
        const { data, error } = await resend.emails.send({
          from: 'Breezy-ai <onboarding@resend.dev>',
          to: 'makasueji@gmail.com',
          subject: 'Air Quality Updates',
          react: EmailTemplate({
            location,
            aqi,
            category,
            openWeatherAQI,
            healthImplications,
            cautionaryStatement,
            pm25,
            pm10,
            o3,
            no2,
            so2,
            co,
            formattedTime,
            email,
            message,
          }),
        })

        if (error) {
          console.error('Resend error:', error)
          return NextResponse.json({ success: false, error }, { status: 500 })
        }

        // Stop after first matching user
        return NextResponse.json({ success: true, data }, { status: 200 })
      } catch (err) {
        console.error('Unexpected error:', err)
        return NextResponse.json({ success: false, error: err }, { status: 500 })
      }
    }
  }

  // If no matching user was found with AQI >= threshold
  return NextResponse.json(
    { success: true, message: 'No users met AQI threshold' },
    { status: 201 },
  )
}
