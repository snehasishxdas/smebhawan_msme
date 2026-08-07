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

    const brandingHeader = `
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 36px 24px; text-align: center; border-bottom: 3px solid #10b981;">
        <span style="font-size: 28px; font-weight: 900; color: #10b981; letter-spacing: -0.05em; font-family: sans-serif; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">smebhawan</span>
        <div style="font-size: 10px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 6px; font-family: sans-serif;">⚡ Building Together · Raw Commodities Exchange</div>
      </div>
    `

    const brandingFooter = `
      <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 32px 24px; text-align: center; font-size: 11px; color: #64748b; font-family: sans-serif; line-height: 1.6;">
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; margin-bottom: 24px; font-size: 12px; color: #334155; text-align: left; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);">
          <strong style="color: #0f172a; display: block; margin-bottom: 6px; font-size: 13px;">🤝 Need Sourcing Assistance?</strong>
          Our operations desks are active 24/7 for trade credit limits, Udyam compliance, and raw material logistics support. Reach us at:<br />
          <div style="margin-top: 10px; font-size: 12px;">
            📞 <strong style="color: #475569;">Call Support:</strong> <a href="tel:+918617219004" style="color: #10b981; font-weight: bold; text-decoration: none; margin-left: 4px;">+91 86172 19004</a>
          </div>
          <div style="margin-top: 6px; font-size: 12px;">
            ✉️ <strong style="color: #475569;">Email Helpdesk:</strong> <a href="mailto:smehouse25@gmail.com" style="color: #10b981; font-weight: bold; text-decoration: none; margin-left: 4px;">smehouse25@gmail.com</a>
          </div>
        </div>
        <p style="margin: 0; font-weight: 700; color: #0f172a; letter-spacing: 0.02em;">smebhawan Sourcing & Liquidity Operations</p>
        <p style="margin: 4px 0 0 0; color: #64748b; font-size: 10px;">Salt Lake Sector V, Salt Lake City, Kolkata, WB 700091</p>
        <div style="margin-top: 16px; font-size: 9px; color: #94a3b8; line-height: 1.4;">
          This is a secure automated notification from the registry controller. Please do not reply directly to this email address.
        </div>
      </div>
    `

    const mailOptions = {
      from: `"smebhawan Support" <${smtpUser}>`,
      to: email,
      subject: `[smebhawan] 💬 Response to your Enquiry: ${subject || 'General Assistance'}`,
      text: `Hello ${name || 'there'},\n\nThank you for reaching out to smebhawan.\n\nIn response to your query regarding "${subject || 'General Enquiry'}":\n\n"${replyText}"\n\nBest regards,\nsmebhawan Support Team`,
      html: `
        <div style="max-width: 580px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #0f172a;">💬 Reply to Your Doubt / Enquiry</h3>
            <p style="font-size: 14px; color: #475569;">Hello ${name || 'there'},</p>
            <p style="font-size: 14px; color: #475569;">Thank you for contacting the smebhawan helpdesk. An administrator has reviewed and responded to your query:</p>
            
            <div style="background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
              <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 6px; letter-spacing: 0.05em;">Subject of Inquiry</div>
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">${subject || 'General Enquiry'}</div>
              
              <div style="border-top: 1px solid #cbd5e1; padding-top: 12px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 6px; letter-spacing: 0.05em;">Support Response</div>
                <div style="font-size: 13.5px; color: #334155; white-space: pre-wrap; font-style: italic; line-height: 1.5;">"${replyText}"</div>
              </div>
            </div>
            
            <p style="font-size: 12px; color: #64748b;">If you need further clarification or additional assistance, please contact our helpline or submit another enquiry via the portal.</p>
          </div>
          ${brandingFooter}
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
