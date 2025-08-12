# Email Configuration Setup Guide

This guide will help you configure email confirmations to use your Vercel deployment URL: `https://trust-tai-os-version.vercel.app/`

## 1. Environment Variables Setup

### Local Development (.env.local)
Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Application URL Configuration
NEXT_PUBLIC_APP_URL=https://trust-tai-os-version.vercel.app

# Email Configuration
EMAIL_PROVIDER=mock
```

### Vercel Deployment
Add these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:
   - `NEXT_PUBLIC_APP_URL`: `https://trust-tai-os-version.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

## 2. Supabase Configuration

### Site URL Configuration
1. Go to your Supabase dashboard
2. Navigate to Authentication > URL Configuration
3. Set the following URLs:
   - **Site URL**: `https://trust-tai-os-version.vercel.app`
   - **Redirect URLs**: 
     - `https://trust-tai-os-version.vercel.app/auth/callback`
     - `https://trust-tai-os-version.vercel.app/dashboard`
     - `https://trust-tai-os-version.vercel.app/onboarding`

### Email Templates (Optional)
If you want to customize email templates in Supabase:

1. Go to Authentication > Email Templates
2. Update the templates to use your Vercel URL:
   - **Confirm signup**: `https://trust-tai-os-version.vercel.app/auth/callback?token={{ .Token }}&type=email_confirmation`
   - **Reset password**: `https://trust-tai-os-version.vercel.app/auth/callback?token={{ .Token }}&type=password_reset`
   - **Magic link**: `https://trust-tai-os-version.vercel.app/auth/callback?token={{ .Token }}&type=magic_link`

## 3. Email Provider Setup

### Option 1: Use Supabase Built-in Email (Recommended)
Supabase provides email functionality out of the box. No additional setup required.

### Option 2: Custom Email Provider
If you want to use a custom email provider, update your `.env.local`:

```bash
# For SendGrid
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key

# For AWS SES
EMAIL_PROVIDER=aws-ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# For SMTP (Gmail, etc.)
EMAIL_PROVIDER=nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 4. Testing Email Confirmations

### Test Email Confirmation Flow
1. Deploy your application to Vercel
2. Go to `https://trust-tai-os-version.vercel.app/onboarding`
3. Create a new account with a valid email
4. Check your email for the confirmation link
5. Click the link - it should redirect to your Vercel deployment

### Test Password Reset Flow
1. Go to the login page
2. Click "Forgot password?"
3. Enter your email
4. Check your email for the reset link
5. Click the link - it should redirect to your Vercel deployment

## 5. Troubleshooting

### Common Issues

**Issue**: Email links redirect to localhost instead of Vercel URL
**Solution**: Make sure `NEXT_PUBLIC_APP_URL` is set correctly in both local and Vercel environment variables

**Issue**: Supabase authentication errors
**Solution**: Verify that your Supabase site URL and redirect URLs are correctly configured

**Issue**: Email not sending
**Solution**: Check your email provider configuration and ensure the service is properly set up

### Debug Mode
To debug email issues, set `EMAIL_PROVIDER=mock` in your environment variables. This will log emails to the console instead of sending them.

## 6. Security Considerations

- Always use HTTPS URLs in production
- Keep your Supabase service role key secure
- Regularly rotate API keys
- Monitor email delivery rates
- Set appropriate token expiration times

## 7. Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase site URL configured
- [ ] Redirect URLs added to Supabase
- [ ] Email templates updated (if using custom templates)
- [ ] Email provider configured (if not using Supabase built-in)
- [ ] Test email confirmation flow
- [ ] Test password reset flow
- [ ] Test magic link flow (if enabled)

## 8. Monitoring

Monitor your email delivery and authentication flows:
- Check Vercel function logs for email-related errors
- Monitor Supabase authentication logs
- Track email delivery rates in your email provider dashboard
- Set up alerts for authentication failures

---

**Note**: The email templates in `src/lib/emailTemplates.ts` are automatically configured to use the `NEXT_PUBLIC_APP_URL` environment variable. Make sure this is set correctly for your deployment.
