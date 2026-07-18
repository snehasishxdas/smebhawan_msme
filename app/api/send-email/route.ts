import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { action, email, name, code, timestamp, role, status, subject, message, replyText, orderDetails, productDetails } = await request.json()

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

    if (action === 'send-otp') {
      emailSubject = `[smebhawan] 🔒 OTP Verification Code: ${code}`
      emailText = `Hello,\n\nYour 6-digit verification code is: ${code}.\n\nThis OTP is valid for 5 minutes. If you did not request this, please disregard this email.`
      emailHtml = `
        <div style="max-width: 580px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #0f172a;">🔒 Secure Account Verification</h3>
            <p style="font-size: 14px; color: #475569;">Hello,</p>
            <p style="font-size: 14px; color: #475569;">Please use the 6-digit verification code below to authorize your secure sign-in / sign-up request:</p>
            
            <div style="margin: 28px 0; text-align: center;">
              <span style="display: inline-block; font-size: 36px; font-weight: 800; color: #10b981; letter-spacing: 0.25em; padding: 14px 28px; background-color: #f0fdf4; border: 2px dashed #10b981; border-radius: 14px; font-family: monospace;">${code}</span>
            </div>

            <p style="font-size: 12px; color: #64748b;">This OTP code is valid for exactly <strong>5 minutes</strong>. If you did not initiate this authorization request, you can safely ignore this email.</p>
          </div>
          ${brandingFooter}
        </div>
      `
    } else if (action === 'login-alert') {
      emailSubject = `[smebhawan] ⚠️ Security Alert: New Login Session`
      emailText = `Hello,\n\nA new login has been authorized for your profile (${email}) at ${timestamp}.\n\nRole: ${role}\nIf this was not you, contact us.`
      emailHtml = `
        <div style="max-width: 580px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #e11d48;">⚠️ Security Alert: New Login Authorized</h3>
            <p style="font-size: 14px; color: #475569;">Hello,</p>
            <p style="font-size: 14px; color: #475569;">We detected a new login session for your registered registry credentials:</p>
            
            <div style="background-color: #fff1f2; border: 1px solid #ffe4e6; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px; color: #9f1239;">
              <div style="margin-bottom: 8px;"><strong>Account Profile:</strong> <span style="font-family: monospace;">${email}</span></div>
              <div style="margin-bottom: 8px;"><strong>Portal Authorized:</strong> <span style="text-transform: uppercase; font-weight: 700; color: #e11d48;">${role}</span></div>
              <div><strong>Timestamp:</strong> ${timestamp}</div>
            </div>

            <p style="font-size: 12px; color: #64748b;">If this session was initiated by you, no further action is required. If you suspect unauthorized access, please reset your authentication credentials immediately.</p>
          </div>
          ${brandingFooter}
        </div>
      `
    } else if (action === 'signup-success') {
      emailSubject = `[smebhawan] 🎉 Account Created Successfully!`
      emailText = `Hello ${name || 'there'},\n\nWelcome to smebhawan! Your registration was completed successfully.\n\nRole: ${role}\nCompany: ${name}\nYou can now execute contracts and browse raw material grades.`
      emailHtml = `
        <div style="max-width: 580px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 20px; font-weight: 700; color: #10b981;">🎉 Congratulations! Account Verified</h3>
            <p style="font-size: 14px; color: #475569;">Hello ${name || 'there'},</p>
            <p style="font-size: 14px; color: #475569;">We are absolutely thrilled to welcome you to the smebhawan B2B procurement network! 🤝 Thank you for registering with us.</p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
              <div style="margin-bottom: 8px;"><strong>Authorized Name:</strong> ${name}</div>
              <div style="margin-bottom: 8px;"><strong>Registered Email:</strong> <span style="font-family: monospace;">${email}</span></div>
              <div><strong>Assigned Portal:</strong> <span style="text-transform: uppercase; font-weight: 700; color: #10b981;">${role}</span></div>
            </div>

            <p style="font-size: 13px; color: #475569;">You are now cleared to access spot prices, apply for MSME credit lines, and publish/vet raw material catalog listings.</p>
          </div>
          ${brandingFooter}
        </div>
      `
    } else if (action === 'vetting-status') {
      const isApproved = status === 'verified'
      emailSubject = `[smebhawan] Vetting Status Outcome: ${isApproved ? '🎉 Approved' : 'Rejected'}`
      emailText = `Hello Supplier,\n\nYour supplier registration has been reviewed.\n\nStatus Outcome: ${isApproved ? 'VERIFIED' : 'REJECTED'}.`
      emailHtml = `
        <div style="max-width: 580px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: ${isApproved ? '#10b981' : '#ef4444'};">Vetting Process Outcome</h3>
            <p style="font-size: 14px; color: #475569;">Hello Supplier,</p>
            <p style="font-size: 14px; color: #475569;">The Operations Command Board has completed the compliance and credential audit for your supplier profile:</p>
            
            <div style="background-color: ${isApproved ? '#f0fdf4' : '#fef2f2'}; border: 1px solid ${isApproved ? '#dcfce7' : '#fee2e2'}; border-radius: 12px; padding: 18px; margin: 20px 0; text-align: center;">
              <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.15em;">Vetting Decision</div>
              <div style="font-size: 24px; font-weight: 800; color: ${isApproved ? '#10b981' : '#ef4444'}; margin-top: 6px; letter-spacing: 0.05em;">
                ${isApproved ? '🎉 VERIFIED / ACTIVE' : '❌ REJECTED / INACTIVE'}
              </div>
            </div>

            <p style="font-size: 13px; color: #475569;">
              ${isApproved 
                ? 'Congratulations! Your audits are clear. You are now authorized to publish catalog listings, list raw materials, and process active logistics orders.' 
                : 'We regret to inform you that your profile registration did not clear compliance verification parameters. Please contact our helpdesk if you believe this is in error.'}
            </p>
          </div>
          ${brandingFooter}
        </div>
      `
    } else if (action === 'termination-alert') {
      emailSubject = `[smebhawan] ❌ Important: Profile Deletion Notification`
      emailText = `Hello,\n\nWe are writing to notify you that your registry credentials have been deleted. All database records associated with ${email} have been permanently wiped.`
      emailHtml = `
        <div style="max-width: 580px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #ef4444;">❌ Registration Wiped / Suspended</h3>
            <p style="font-size: 14px; color: #475569;">Hello,</p>
            <p style="font-size: 14px; color: #475569;">Please review this critical update regarding your smebhawan portal access:</p>
            
            <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 18px; margin: 20px 0; font-size: 13px; color: #991b1b;">
              <strong>Registry Credentials Revoked</strong><br />
              The administrator has terminated this profile from the exchange. All active listings, pending audits, and credentials associated with <span style="font-family: monospace; font-weight: bold;">${email}</span> have been permanently deleted from our servers.
            </div>

            <p style="font-size: 12px; color: #64748b;">If you wish to list raw materials or source commodities again, you must initiate a clean sign-up request.</p>
          </div>
          ${brandingFooter}
        </div>
      `
    } else if (action === 'order-placed') {
      const order = orderDetails || {}
      emailSubject = `[smebhawan] 🛒 Order Logged: ${order.orderId}`
      emailText = `Hello,\n\nYour order ${order.orderId} has been logged. Status: waiting for approval.`
      emailHtml = `
        <div style="max-width: 580px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #10b981;">🎉 Order Logged Successfully!</h3>
            <p style="font-size: 14px; color: #475569;">Hello,</p>
            <p style="font-size: 14px; color: #475569;">🤝 Thank you for placing your raw materials order. The contract is currently **awaiting credit check clearance**:</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
              <div style="margin-bottom: 8px;"><strong>Order ID:</strong> <span style="font-family: monospace; font-weight: bold;">${order.orderId}</span></div>
              <div style="margin-bottom: 8px;"><strong>Buyer Company:</strong> ${order.companyName}</div>
              <div style="margin-bottom: 8px;"><strong>Settlement:</strong> ${order.paymentMethod}</div>
              <div style="margin-bottom: 8px;"><strong>Contract Value:</strong> ₹${order.totalValue?.toLocaleString('en-IN')}</div>
              <div><strong>Status:</strong> <span style="color: #d97706; font-weight: bold;">waiting for approval</span></div>
            </div>

            <p style="font-size: 12px; color: #64748b;">Our operations team will underwrite the credit parameters and transition the contract. Once verified, logistics tracking will be enabled immediately.</p>
          </div>
          ${brandingFooter}
        </div>
      `
    } else if (action === 'order-status-update') {
      const order = orderDetails || {}
      emailSubject = `[smebhawan] ⚡ Order Status Update: ${order.status}`
      emailText = `Hello,\n\nThe tracking status of order ${order.orderId} has transitioned to: ${order.status}.`
      emailHtml = `
        <div style="max-width: 580px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #38bdf8;">🚚 Logistics Tracking Update</h3>
            <p style="font-size: 14px; color: #475569;">Hello,</p>
            <p style="font-size: 14px; color: #475569;">The logistics tracking status of your B2B raw materials contract has transitioned:</p>
            
            <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 18px; margin: 20px 0; text-align: center;">
              <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Fulfillment Tracking State</div>
              <div style="font-size: 26px; font-weight: 800; color: #0284c7; margin-top: 6px; text-transform: uppercase;">
                ${order.status}
              </div>
            </div>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; font-size: 12px; color: #334155;">
              <div style="margin-bottom: 6px;"><strong>Order ID:</strong> <span style="font-family: monospace;">${order.orderId}</span></div>
              <div style="margin-bottom: 6px;"><strong>Fulfill Company:</strong> ${order.companyName}</div>
              ${order.vehicleNo ? `<div style="margin-bottom: 6px;"><strong>Carrier Vehicle No:</strong> ${order.vehicleNo}</div>` : ''}
              ${order.lrNo ? `<div><strong>Lorry Receipt (LR) No:</strong> ${order.lrNo}</div>` : ''}
            </div>
          </div>
          ${brandingFooter}
        </div>
      `
    } else if (action === 'listing-request') {
      const prod = productDetails || {}
      const isSupplier = email === prod.supplierEmail
      
      if (isSupplier) {
        emailSubject = `[smebhawan] ⚡ Listing Request Logged: ${prod.name}`
        emailText = `Hello Supplier,\n\nWe received your request to list/edit ${prod.name}. Status: Pending Vetting.`
        emailHtml = `
          <div style="max-width: 580px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
            ${brandingHeader}
            <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
              <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #f59e0b;">⚡ Listing Request Logged</h3>
              <p style="font-size: 14px; color: #475569;">Hello Supplier,</p>
              <p style="font-size: 14px; color: #475569;">Your raw material catalog listing/update request has been submitted for compliance verification:</p>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
                <div style="margin-bottom: 8px;"><strong>Material Name:</strong> ${prod.name}</div>
                <div style="margin-bottom: 8px;"><strong>Contract Rate:</strong> ₹${prod.rate?.toLocaleString('en-IN')}/MT</div>
                <div style="margin-bottom: 8px;"><strong>Inventory:</strong> ${prod.inventory} MT</div>
                <div style="margin-bottom: 8px;"><strong>Request Type:</strong> <span style="font-weight: bold; text-transform: uppercase;">${prod.type}</span></div>
                <div><strong>Status:</strong> <span style="color: #d97706; font-weight: bold; text-transform: uppercase;">Pending Vetting</span></div>
              </div>

              <p style="font-size: 12px; color: #64748b;">No further action is required. Our compliance team will audit the technical specs and propagate live updates immediately.</p>
            </div>
            ${brandingFooter}
          </div>
        `
      } else {
        emailSubject = `[smebhawan Admin] Vetting Required: ${prod.name}`
        emailText = `Hello Admin,\n\nSupplier ${prod.supplierCompany} has requested a listing/edit.`
        emailHtml = `
          <div style="max-width: 580px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
            ${brandingHeader}
            <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
              <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #f59e0b;">🔔 Catalog Vetting Required</h3>
              <p style="font-size: 14px; color: #475569;">Hello Admin,</p>
              <p style="font-size: 14px; color: #475569;">A supplier has submitted a material listing proposal for compliance check:</p>
              
              <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
                <div style="margin-bottom: 8px;"><strong>Supplier:</strong> ${prod.supplierCompany} (${prod.supplierEmail})</div>
                <div style="margin-bottom: 8px;"><strong>Material Name:</strong> ${prod.name}</div>
                <div style="margin-bottom: 8px;"><strong>Proposed Rate:</strong> ₹${prod.rate?.toLocaleString('en-IN')}/MT</div>
                <div style="margin-bottom: 8px;"><strong>Proposed Inventory:</strong> ${prod.inventory} MT</div>
                <div><strong>Type:</strong> <span style="font-weight: bold; text-transform: uppercase;">${prod.type}</span></div>
              </div>

              <p style="font-size: 12px; color: #64748b;">Please inspect details, verify quality certification PDFs, and approve or reject the request.</p>
            </div>
            ${brandingFooter}
          </div>
        `
      }
    } else if (action === 'listing-status-update') {
      const prod = productDetails || {}
      const isApproved = prod.status === 'approved'
      emailSubject = `[smebhawan] Listing Vetting Outcome: ${isApproved ? '🎉 Approved' : 'Rejected'}`
      emailText = `Hello Supplier,\n\nYour listing request for ${prod.name} has been ${prod.status}.`
      emailHtml = `
        <div style="max-width: 580px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
          ${brandingHeader}
          <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
            <h3 style="margin-top: 0; font-size: 18px; font-weight: 700; color: ${isApproved ? '#10b981' : '#ef4444'};">Material Vetting Outcome</h3>
            <p style="font-size: 14px; color: #475569;">Hello Supplier,</p>
            <p style="font-size: 14px; color: #475569;">Operations team has completed vetting of your catalog listing request:</p>
            
            <div style="background-color: ${isApproved ? '#f0fdf4' : '#fef2f2'}; border: 1px solid ${isApproved ? '#dcfce7' : '#fee2e2'}; border-radius: 12px; padding: 18px; margin: 20px 0; text-align: center;">
              <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Listing Vetting Decision</div>
              <div style="font-size: 24px; font-weight: 800; color: ${isApproved ? '#10b981' : '#ef4444'}; margin-top: 6px; letter-spacing: 0.05em; text-transform: uppercase;">
                ${isApproved ? '🎉 APPROVED / LIVE' : '❌ REJECTED'}
              </div>
            </div>

            <p style="font-size: 13px; color: #475569;">
              <strong>Material:</strong> ${prod.name}<br />
              <strong>Rate:</strong> ₹${prod.rate?.toLocaleString('en-IN')}/MT<br />
              <strong>Status:</strong> ${isApproved ? 'Successfully updated in the public marketplace exchange.' : 'Vetting request declined due to regulatory compliance check parameters.'}
            </p>
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
