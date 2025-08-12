# Email Service Setup for User Invitations

This document explains how to set up the email service for sending user invitation emails when creating new users through the admin dashboard.

## Overview

When an admin creates a new user through the "Add User" modal, the system will:
1. Create the user account in the database
2. Generate a secure temporary password
3. Send an invitation email with login credentials
4. The user can then log in using their email and the temporary password

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Service Configuration
# Choose one of the following email providers:
```

## Email Provider Options

### 1. Mock Email Service (Development)
For development and testing, use the mock service that logs emails to the console:

```bash
EMAIL_PROVIDER=mock
```

### 2. SendGrid
For production use with SendGrid:

```bash
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

Install the package:
```bash
npm install @sendgrid/mail
```

### 3. AWS SES
For production use with Amazon SES:

```bash
EMAIL_PROVIDER=aws-ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
```

Install the package:
```bash
npm install @aws-sdk/client-ses
```

### 4. SMTP (Nodemailer)
For production use with any SMTP server:

```bash
EMAIL_PROVIDER=nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
```

Install the package:
```bash
npm install nodemailer
```

## How It Works

### 1. User Creation Flow
1. Admin fills out the "Add User" modal with:
   - Full Name (required)
   - Email Address (required)
   - Role (required)
   - Department (optional)
   - Position (optional)

2. Admin clicks "Create User"

3. System processes the request:
   - Validates required fields
   - Checks if user already exists
   - Generates a secure 12-character temporary password
   - Creates user account in database
   - Sends invitation email
   - Logs the action in audit trail

### 2. Email Content
The invitation email includes:
- Welcome message
- User's name and email
- Temporary password
- Login button
- Security reminder to change password
- Support contact information

### 3. User Login
The invited user can:
- Go to the login page
- Use their email address
- Use the temporary password from the email
- Log in successfully
- Be prompted to change their password

## Security Features

- **Temporary Passwords**: 12 characters with mixed case, numbers, and symbols
- **Password Expiry**: Users are encouraged to change password after first login
- **Audit Logging**: All user creation actions are logged
- **Duplicate Prevention**: System checks for existing users before creation

## Testing

### Mock Service
With the mock service, emails are logged to the console. Check your terminal/console when creating users.

### Real Email Service
With a real email service configured, actual emails will be sent to the specified email addresses.

## Troubleshooting

### Email Not Sending
1. Check environment variables are set correctly
2. Verify email provider credentials
3. Check console for error messages
4. Ensure the email service package is installed

### User Creation Fails
1. Check database connection
2. Verify required fields are filled
3. Check for duplicate email addresses
4. Review server logs for errors

## Production Considerations

1. **Email Templates**: Customize email content for your brand
2. **Rate Limiting**: Implement rate limiting for user creation
3. **Email Verification**: Consider adding email verification step
4. **Password Policies**: Implement strong password requirements
5. **Monitoring**: Set up monitoring for email delivery rates

## Support

For issues or questions:
1. Check the console logs
2. Verify environment configuration
3. Test with mock service first
4. Review the API endpoint logs
