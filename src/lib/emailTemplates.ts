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
  })
}

// Helper function to get the appropriate template
export function getEmailTemplate(type: 'emailConfirmation' | 'passwordReset' | 'magicLink', email: string, token: string) {
  return EMAIL_TEMPLATES[type](email, token)
}
