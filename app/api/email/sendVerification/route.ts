import { EmailTemplate } from '@/components/email/email-verification-template'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, verificationCode } = await req.json()

  try {
    const { data, error } = await resend.emails.send({
      from: 'Breezy-ai <onboarding@resend.dev>',
      to: 's3983370@rmit.edu.vn',
      subject: 'Verification Changing Password',
      react: EmailTemplate({ email, verificationCode }),
    })

    if (error) {
      console.log('Error sending email:', error)
      return NextResponse.json({ success: false, error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.log('Unexpected error sending email:', error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
