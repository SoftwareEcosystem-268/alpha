import { NextRequest, NextResponse } from 'next/server'
import { OTPModel } from '@/lib/models'

// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    await OTPModel.create(email, otp)

    // TODO: Send OTP via email
    // For now, log it to console (remove in production)
    console.log('OTP for', email, ':', otp)

    // In production, use a service like SendGrid, Nodemailer, etc.
    // await sendEmail({
    //   to: email,
    //   subject: 'Password Reset Code',
    //   text: `Your password reset code is: ${otp}`,
    // })

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
