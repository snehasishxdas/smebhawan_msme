import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { email, subject, replyText, name } = await request.json()

    if (!email || !replyText) {
      return NextResponse.json({ error: 'Missing email or reply text' }, { status: 400 })
    }

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
    const smtpPort = parseInt(process.env.SMTP_PORT || '587')
    const smtpUser = process.env.SMTP_USER || 'smehouse25@gmail.com'
    const smtpPass = process.env.SMTP_PASS

    console.log(`[SMTP] Routing mail to: ${email} (Subject: Reply to your doubt: ${subject})`)

    if (!smtpPass) {
      console.warn('[SMTP] SMTP_PASS is undefined in environment keys. Mail simulation output successfully logged.')
      return NextResponse.json({ success: true, simulated: true })
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const mailOptions = {
      from: `"SmeBhawan Support" <${smtpUser}>`,
      to: email,
      subject: `Reply to your doubt: ${subject || 'General Enquiry'}`,
      text: `Hello ${name || 'there'},\n\nThank you for reaching out to SmeBhawan.\n\nHere is the response to your doubt:\n\n"${replyText}"\n\nBest regards,\nSmeBhawan Support Team`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #10b981; margin-top: 0;">SmeBhawan Support</h2>
          <p>Hello ${name || 'there'},</p>
          <p>Thank you for reaching out to SmeBhawan.</p>
          <p>Here is the response to your enquiry:</p>
          <div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0; border-radius: 4px;">
            <p style="margin: 0; font-style: italic; white-space: pre-wrap;">${replyText}</p>
          </div>
          <br>
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 0; font-weight: bold; color: #10b981;">SmeBhawan Support Team</p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[SMTP] Error dispatching mail:', error)
    return NextResponse.json({ error: error.message || 'SMTP dispatch failed' }, { status: 500 })
  }
}
