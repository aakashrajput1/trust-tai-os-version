// Email Templates Configuration
// This file contains email templates with proper URLs for the deployed application

export const EMAIL_CONFIG = {
  // Base URL for the deployed application
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://trust-tai-os-version.vercel.app',
  
  // Email confirmation URL
  CONFIRMATION_URL: `${process.env.NEXT_PUBLIC_APP_URL || 'https://trust-tai-os-version.vercel.app'}/auth/callback`,
  
  // Password reset URL
  PASSWORD_RESET_URL: `${process.env.NEXT_PUBLIC_APP_URL || 'https://trust-tai-os-version.vercel.app'}/auth/callback`,
  
  // Magic link URL
  MAGIC_LINK_URL: `${process.env.NEXT_PUBLIC_APP_URL || 'https://trust-tai-os-version.vercel.app'}/auth/callback`,
}

export const EMAIL_TEMPLATES = {
  // Email confirmation template
  emailConfirmation: (email: string, token: string) => ({
    subject: 'Confirm your email address - Trust TAI OS',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirm your email address</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Trust TAI OS</h1>
            <p>Confirm your email address to get started</p>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>Thank you for signing up for Trust TAI OS. To complete your registration, please confirm your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${EMAIL_CONFIG.CONFIRMATION_URL}?token=${token}&type=email_confirmation" class="button">
                Confirm Email Address
              </a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px; font-size: 12px;">
              ${EMAIL_CONFIG.CONFIRMATION_URL}?token=${token}&type=email_confirmation
            </p>
            
            <p>This link will expire in 24 hours for security reasons.</p>
            
            <p>If you didn't create an account with Trust TAI OS, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Trust TAI OS. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to Trust TAI OS

Hello!

Thank you for signing up for Trust TAI OS. To complete your registration, please confirm your email address by visiting this link:

${EMAIL_CONFIG.CONFIRMATION_URL}?token=${token}&type=email_confirmation

This link will expire in 24 hours for security reasons.

If you didn't create an account with Trust TAI OS, you can safely ignore this email.

© 2024 Trust TAI OS. All rights reserved.
This email was sent to ${email}
    `
  }),

  // Password reset template
  passwordReset: (email: string, token: string) => ({
    subject: 'Reset your password - Trust TAI OS',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
            <p>Reset your Trust TAI OS password</p>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>We received a request to reset your password for your Trust TAI OS account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${EMAIL_CONFIG.PASSWORD_RESET_URL}?token=${token}&type=password_reset" class="button">
                Reset Password
              </a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px; font-size: 12px;">
              ${EMAIL_CONFIG.PASSWORD_RESET_URL}?token=${token}&type=password_reset
            </p>
            
            <p>This link will expire in 1 hour for security reasons.</p>
            
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Trust TAI OS. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset Request - Trust TAI OS

Hello!

We received a request to reset your password for your Trust TAI OS account. Click the link below to create a new password:

${EMAIL_CONFIG.PASSWORD_RESET_URL}?token=${token}&type=password_reset

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

© 2024 Trust TAI OS. All rights reserved.
This email was sent to ${email}
    `
  }),

  // Magic link template
  magicLink: (email: string, token: string) => ({
    subject: 'Sign in to Trust TAI OS',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign in to Trust TAI OS</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sign in to Trust TAI OS</h1>
            <p>Click the button below to sign in</p>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>You requested a magic link to sign in to your Trust TAI OS account. Click the button below to sign in:</p>
            
            <div style="text-align: center;">
              <a href="${EMAIL_CONFIG.MAGIC_LINK_URL}?token=${token}&type=magic_link" class="button">
                Sign in to Trust TAI OS
              </a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px; font-size: 12px;">
              ${EMAIL_CONFIG.MAGIC_LINK_URL}?token=${token}&type=magic_link
            </p>
            
            <p>This link will expire in 1 hour for security reasons.</p>
            
            <p>If you didn't request this magic link, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Trust TAI OS. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Sign in to Trust TAI OS

Hello!

You requested a magic link to sign in to your Trust TAI OS account. Click the link below to sign in:

${EMAIL_CONFIG.MAGIC_LINK_URL}?token=${token}&type=magic_link

This link will expire in 1 hour for security reasons.

If you didn't request this magic link, you can safely ignore this email.

© 2024 Trust TAI OS. All rights reserved.
This email was sent to ${email}
    `
  }),

  // Account approval template
  accountApproved: (userName: string, userEmail: string, role: string) => ({
    subject: 'Your account has been approved - Trust TAI OS',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Approved - Trust TAI OS</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .role-badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 5px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Account Approved!</h1>
            <p>Welcome to Trust TAI OS</p>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Great news! Your account has been approved by our administrator. You can now access the Trust TAI OS platform.</p>
            
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0369a1;">Account Details:</h3>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Role:</strong> <span class="role-badge">${role}</span></p>
            </div>
            
            <div style="text-align: center;">
              <a href="${EMAIL_CONFIG.BASE_URL}/login" class="button">
                Sign in to Trust TAI OS
              </a>
            </div>
            
            <p>You can now:</p>
            <ul>
              <li>Sign in to your account</li>
              <li>Access your role-specific dashboard</li>
              <li>Start using all platform features</li>
              <li>Connect with your team members</li>
            </ul>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Welcome aboard! 🚀</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Trust TAI OS. All rights reserved.</p>
            <p>This email was sent to ${userEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Account Approved - Trust TAI OS

Hello ${userName}!

Great news! Your account has been approved by our administrator. You can now access the Trust TAI OS platform.

Account Details:
- Email: ${userEmail}
- Role: ${role}

You can now sign in to your account at: ${EMAIL_CONFIG.BASE_URL}/login

You can now:
- Sign in to your account
- Access your role-specific dashboard
- Start using all platform features
- Connect with your team members

If you have any questions or need assistance, please don't hesitate to contact our support team.

Welcome aboard!

© 2024 Trust TAI OS. All rights reserved.
This email was sent to ${userEmail}
    `
  }),

  // Account rejection template
  accountRejected: (userName: string, userEmail: string, role: string, adminNotes?: string) => ({
    subject: 'Account Application Update - Trust TAI OS',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Application Update - Trust TAI OS</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .notes-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Application Update</h1>
            <p>Trust TAI OS</p>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Thank you for your interest in joining Trust TAI OS. After careful review of your application, we regret to inform you that we are unable to approve your account at this time.</p>
            
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0369a1;">Application Details:</h3>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Requested Role:</strong> ${role}</p>
            </div>
            
            ${adminNotes ? `
            <div class="notes-box">
              <h3 style="margin-top: 0; color: #dc2626;">Administrator Notes:</h3>
              <p>${adminNotes}</p>
            </div>
            ` : ''}
            
            <p>If you believe this decision was made in error or if you would like to provide additional information, please contact our support team.</p>
            
            <div style="text-align: center;">
              <a href="${EMAIL_CONFIG.BASE_URL}/contact" class="button">
                Contact Support
              </a>
            </div>
            
            <p>We appreciate your understanding and hope to have the opportunity to work with you in the future.</p>
            
            <p>Best regards,<br>The Trust TAI OS Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Trust TAI OS. All rights reserved.</p>
            <p>This email was sent to ${userEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Account Application Update - Trust TAI OS

Hello ${userName},

Thank you for your interest in joining Trust TAI OS. After careful review of your application, we regret to inform you that we are unable to approve your account at this time.

Application Details:
- Email: ${userEmail}
- Requested Role: ${role}

${adminNotes ? `Administrator Notes: ${adminNotes}` : ''}

If you believe this decision was made in error or if you would like to provide additional information, please contact our support team at: ${EMAIL_CONFIG.BASE_URL}/contact

We appreciate your understanding and hope to have the opportunity to work with you in the future.

Best regards,
The Trust TAI OS Team

© 2024 Trust TAI OS. All rights reserved.
This email was sent to ${userEmail}
    `
  })
}

// Helper function to get the appropriate template
export function getEmailTemplate(type: 'emailConfirmation' | 'passwordReset' | 'magicLink' | 'accountApproved' | 'accountRejected', email: string, token?: string, userName?: string, role?: string, adminNotes?: string) {
  switch (type) {
    case 'emailConfirmation':
    case 'passwordReset':
    case 'magicLink':
      return EMAIL_TEMPLATES[type](email, token!)
    case 'accountApproved':
      return EMAIL_TEMPLATES[type](userName!, email, role!)
    case 'accountRejected':
      return EMAIL_TEMPLATES[type](userName!, email, role!, adminNotes)
    default:
      throw new Error(`Unknown email template type: ${type}`)
  }
}
