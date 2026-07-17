import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { action, email, name, code, timestamp, role, status, subject, message, replyText } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 })
    }

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
    const smtpPort = parseInt(process.env.SMTP_PORT || '587')
    const smtpUser = process.env.SMTP_USER || 'smehouse25@gmail.com'
    const smtpPass = process.env.SMTP_PASS

    console.log(`[SMTP API] Dispatching mail alert. Action: ${action}, Recipient: ${email}`)

    // If SMTP password is not set, log output and mock success to prevent crashes
    if (!smtpPass) {
      console.warn('[SMTP API] SMTP_PASS is undefined in .env.local. Email dispatch simulated successfully in terminal.')
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

    let emailSubject = ''
    let emailHtml = ''
    let emailText = ''

    const brandingHeader = `
      <div style="background-color: #0f172a; padding: 32px 24px; text-align: center; border-radius: 16px 16px 0 0;">
        <span style="font-size: 24px; font-weight: 900; color: #10b981; letter-spacing: -0.05em; font-family: sans-serif;">smebhawan</span>
        <div style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px; font-family: sans-serif;">Building Together · MSME Platform</div>
      </div>
    `

    const brandingFooter = `
      <div style="margin-top: 32px; border-t: 1px solid #e2e8f0; padding-top: 24px; text-align: center; font-size: 11px; color: #64748b; font-family: sans-serif;">
        <p style="margin: 0; font-weight: 600;">smebhawan Sourcing & Liquidity Operations</p>
        <p style="margin: 4px 0 0 0;">Salt Lake Sector V, Kolkata, West Bengal 700091</p>
        <p style="margin: 12px 0 0 0; font-size: 9px; color: #94a3b8;">This is an automated system security alert. Please do not reply directly to this mail.</p>
      </div>
    `

    if (action === 'send-otp') {
      emailSubject = `[smebhawan] OTP Verification Code: ${code}`
      emailText = `Hello,\n\nYour 6-digit smebhawan verification OTP code is: ${code}.\n\nThis OTP is valid for 5 minutes. If you did not request this, please disregard this email.`
      emailHtml = `
        <div style="max-width: 580px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; font-family: sans-serif; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #0f172a;">Verify Your Account</h3>
            <p style="font-size: 14px; color: #475569;">Hello,</p>
            <p style="font-size: 14px; color: #475569;">Please use the 6-digit verification code below to authorize your sign-in / sign-up request:</p>
            
            <div style="margin: 28px 0; text-align: center;">
              <span style="display: inline-block; font-size: 32px; font-weight: 800; color: #10b981; letter-spacing: 0.25em; padding: 12px 24px; background-color: #f0fdf4; border: 1px dashed #bbf7d0; border-radius: 12px; font-family: monospace;">${code}</span>
            </div>

            <p style="font-size: 12px; color: #64748b;">This OTP code is valid for exactly <strong>5 minutes</strong>. If you did not initiate this authorization request, you can safely ignore this email.</p>
          </div>
          ${brandingFooter}
        </div>
      `
    } else if (action === 'login-alert') {
      emailSubject = `[smebhawan] Security Alert: New Login Detected`
      emailText = `Hello,\n\nA new login has been authorized for your smebhawan profile (${email}) at ${timestamp}.\n\nRole: ${role}\nIf this request was not authorized by you, please reset your session immediately.`
      emailHtml = `
        <div style="max-width: 580px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; font-family: sans-serif; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #e11d48;">New Login Authorized</h3>
            <p style="font-size: 14px; color: #475569;">Hello,</p>
            <p style="font-size: 14px; color: #475569;">We detected a new login session for your smebhawan registry profile:</p>
            
            <div style="background-color: #fff1f2; border: 1px solid #ffe4e6; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
              <div style="margin-bottom: 8px;"><strong>Account Profile:</strong> <span style="font-family: monospace;">${email}</span></div>
              <div style="margin-bottom: 8px;"><strong>Portal Authorized:</strong> <span style="text-transform: uppercase; font-weight: 700; color: #e11d48;">${role}</span></div>
              <div><strong>Timestamp:</strong> ${timestamp}</div>
            </div>

            <p style="font-size: 12px; color: #64748b;">If this login session was authorized by you, no further action is required. If you suspect unauthorized access, please log out and re-authenticate securely.</p>
          </div>
          ${brandingFooter}
        </div>
      `
    } else if (action === 'signup-success') {
      emailSubject = `[smebhawan] Registration Successful`
      emailText = `Hello ${name || 'there'},\n\nWelcome to smebhawan! Your registration was completed successfully.\n\nRole: ${role}\nCompany: ${name}\nYou can now execute contracts and browse raw material grades.`
      emailHtml = `
        <div style="max-width: 580px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; font-family: sans-serif; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #10b981;">Account Created Successfully</h3>
            <p style="font-size: 14px; color: #475569;">Hello ${name || 'there'},</p>
            <p style="font-size: 14px; color: #475569;">Welcome to smebhawan B2B procurement network! Your account registration is verified and complete:</p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
              <div style="margin-bottom: 8px;"><strong>Authorized Name:</strong> ${name}</div>
              <div style="margin-bottom: 8px;"><strong>Registered Email:</strong> <span style="font-family: monospace;">${email}</span></div>
              <div><strong>Assigned Role:</strong> <span style="text-transform: uppercase; font-weight: 700; color: #10b981;">${role}</span></div>
            </div>

            <p style="font-size: 12px; color: #64748b;">You are now cleared to access spot prices, draw instant credit lines, and coordinate logistics tracking directly from your portal dashboard.</p>
          </div>
          ${brandingFooter}
        </div>
      `
    } else if (action === 'vetting-status') {
      const isApproved = status === 'verified'
      emailSubject = `[smebhawan] Supplier Verification Status: ${isApproved ? 'Approved' : 'Rejected'}`
      emailText = `Hello Supplier,\n\nYour smebhawan supplier registration has been reviewed.\n\nStatus Outcome: ${isApproved ? 'VERIFIED' : 'REJECTED'}.\n\nIf verified, you can now log in using email OTP.`
      emailHtml = `
        <div style="max-width: 580px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; font-family: sans-serif; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: ${isApproved ? '#10b981' : '#ef4444'};"> Vetting Process Outcome</h3>
            <p style="font-size: 14px; color: #475569;">Hello Supplier,</p>
            <p style="font-size: 14px; color: #475569;">The Credit Underwriting and Operations Command board has completed the vetting process for your profile:</p>
            
            <div style="background-color: ${isApproved ? '#f0fdf4' : '#fef2f2'}; border: 1px solid ${isApproved ? '#dcfce7' : '#fee2e2'}; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
              <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.1em;">Vetting Decision</div>
              <div style="font-size: 22px; font-weight: 800; color: ${isApproved ? '#10b981' : '#ef4444'}; margin-top: 6px; letter-spacing: 0.05em;">
                ${isApproved ? 'VERIFIED / ACTIVE' : 'REJECTED / INACTIVE'}
              </div>
            </div>

            <p style="font-size: 13px; color: #475569;">
              ${isApproved 
                ? 'Your registration audits are clear. You are now authorized to log in using OTP verification, list inventory commodities, and configure live pricing rates.' 
                : 'Your profile registration credentials failed verification audits. If you believe this is an error, please submit another registration or contact us.'}
            </p>
          </div>
          ${brandingFooter}
        </div>
      `
    } else if (action === 'termination-alert') {
      emailSubject = `[smebhawan] Urgent: Profile Termination Notification`
      emailText = `Hello,\n\nWe are writing to notify you that your profile associated with ${email} has been terminated and deleted from the smebhawan registry. All associated local and Supabase cloud records have been permanently wiped. If you wish to rejoin, you must sign up again.`
      emailHtml = `
        <div style="max-width: 580px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; font-family: sans-serif; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #ef4444;">Profile Terminated</h3>
            <p style="font-size: 14px; color: #475569;">Hello,</p>
            <p style="font-size: 14px; color: #475569;">Please review this critical update regarding your smebhawan platform credentials:</p>
            
            <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 18px; margin: 20px 0; font-size: 13px; color: #991b1b; line-height: 1.6;">
              <strong>Account Status Wiped</strong><br />
              The administrator has terminated your access profile. All active credentials, local caches, and database listings associated with <span style="font-family: monospace; font-weight: bold;">${email}</span> have been permanently deleted from our servers.
            </div>

            <p style="font-size: 12px; color: #64748b;">If you wish to participate in the sourcing exchange again, you must register as a new customer/supplier. If you have questions regarding this termination, please contact our support desk.</p>
          </div>
          ${brandingFooter}
        </div>
      `
    } else if (action === 'help-reply') {
      emailSubject = `[smebhawan] Reply to Enquiry: ${subject || 'Support Request'}`
      emailText = `Hello ${name || 'there'},\n\nHere is the response regarding your query:\n\nQuery: "${message}"\n\nResponse: "${replyText}"`
      emailHtml = `
        <div style="max-width: 580px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; font-family: sans-serif; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #10b981;">Support Enquiry Answered</h3>
            <p style="font-size: 14px; color: #475569;">Hello ${name || 'there'},</p>
            <p style="font-size: 14px; color: #475569;">An administrator has updated the ticket response regarding your raised query:</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 12px;">
              <div style="margin-bottom: 12px; color: #475569;">
                <span style="font-weight: bold; color: #64748b; text-transform: uppercase; font-size: 9px; block;">Your Doubt:</span>
                <p style="margin: 4px 0 0 0; font-style: italic;">"${message}"</p>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; color: #0f172a;">
                <span style="font-weight: bold; color: #10b981; text-transform: uppercase; font-size: 9px; block;">smebhawan Response:</span>
                <p style="margin: 4px 0 0 0; font-weight: 500; white-space: pre-wrap;">${replyText}</p>
              </div>
            </div>

            <p style="font-size: 12px; color: #64748b;">This inquiry ticket is flagged as replied. In compliance with support SLA standards, it will be automatically archived and set to solved status in 24 hours.</p>
          </div>
          ${brandingFooter}
        </div>
      `
    }

    const mailOptions = {
      from: `"smebhawan Alerts" <${smtpUser}>`,
      to: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    }

    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[SMTP API] SMTP Dispatch error:', error)
    return NextResponse.json({ error: error.message || 'SMTP dispatch failed' }, { status: 500 })
  }
}
