# OAuth SSO Setup Guide

This guide explains how to set up Google and Microsoft OAuth providers in Supabase to enable SSO login functionality.

## Prerequisites

- A Supabase project
- Google Cloud Console access (for Google OAuth)
- Microsoft Azure Portal access (for Microsoft OAuth)

## Google OAuth Setup

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local development)
5. Copy the Client ID and Client Secret

### 2. Supabase Configuration

1. Go to your Supabase dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list and click "Edit"
4. Enable the provider
5. Enter your Google Client ID and Client Secret
6. Save the configuration

## Microsoft OAuth Setup

### 1. Azure Portal Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Fill in the details:
   - Name: Your app name
   - Supported account types: Choose based on your needs
   - Redirect URI: 
     - Type: Web
     - URI: `https://your-project-ref.supabase.co/auth/v1/callback`
5. After creation, note the Application (client) ID
6. Go to "Certificates & secrets" > "New client secret"
7. Create a new secret and note the value
8. Go to "API permissions" and add:
   - Microsoft Graph > Delegated permissions > User.Read
   - Microsoft Graph > Delegated permissions > email
   - Microsoft Graph > Delegated permissions > profile
9. Grant admin consent for the permissions

### 2. Supabase Configuration

1. Go to your Supabase dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Azure" in the list and click "Edit"
4. Enable the provider
5. Enter your Azure Client ID and Client Secret
6. Save the configuration

## Environment Variables

Add these to your `.env.local` file (optional, for reference):

```bash
# OAuth SSO Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_azure_client_id_here
```

## Testing

1. Start your development server
2. Go to the login page
3. Click on "Continue with Google" or "Continue with Microsoft"
4. You should be redirected to the respective OAuth provider
5. After successful authentication, you'll be redirected back to your app

## Troubleshooting

### Common Issues

1. **Redirect URI mismatch**: Ensure the redirect URI in your OAuth provider matches exactly with Supabase's callback URL
2. **CORS issues**: Make sure your domain is whitelisted in Supabase
3. **Permission errors**: Ensure all required permissions are granted in Azure AD
4. **Client ID/Secret mismatch**: Double-check the credentials in Supabase

### Debug Steps

1. Check browser console for errors
2. Verify Supabase logs in the dashboard
3. Ensure OAuth providers are enabled in Supabase
4. Check that redirect URIs are correctly configured

## Security Considerations

1. **Client Secrets**: Never expose client secrets in client-side code
2. **Redirect URIs**: Only use trusted redirect URIs
3. **Permissions**: Grant minimal required permissions
4. **HTTPS**: Use HTTPS in production for all OAuth flows

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Supabase OAuth Providers](https://supabase.com/docs/guides/auth/social-login/auth-google)
