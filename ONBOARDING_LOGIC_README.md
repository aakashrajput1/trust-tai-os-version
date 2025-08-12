# Conditional Onboarding System

This document explains how the onboarding screen is conditionally displayed based on whether a user has already completed the role selection process.

## Overview

The onboarding screen (`/onboarding`) is designed to be shown **only once** to new users. Once a user selects their role and completes onboarding, they will never see this screen again on subsequent logins. Instead, they will be automatically redirected to their respective dashboard.

## How It Works

### 1. Email/Password Login Flow

When a user signs in with email and password:

1. **Authentication**: User credentials are verified
2. **Profile Check**: System checks if user profile exists in the `users` table
3. **Role Check**: System checks if the user has already selected a role (`role` field)
4. **Conditional Redirect**:
   - **If role exists**: User is redirected directly to their dashboard (`/dashboard/{role-path}`)
   - **If no role**: User is redirected to onboarding (`/onboarding`)

**Code Location**: `src/app/login/page.tsx` - `handleSubmit` function (lines ~170-180)

### 2. SSO (Google/Microsoft) Login Flow

When a user signs in with SSO:

1. **OAuth Redirect**: User is redirected to `/auth/callback` after OAuth authentication
2. **Session Verification**: System verifies the OAuth session
3. **Profile Check**: System checks if user profile exists and has a role
4. **Conditional Redirect**:
   - **If role exists**: User is redirected directly to their dashboard
   - **If no role**: User is redirected to onboarding

**Code Location**: `src/app/auth/callback/page.tsx`

### 3. Middleware Protection

The middleware (`src/middleware.ts`) provides additional protection:

1. **Prevents Access to Onboarding**: If a user with an existing role tries to access `/onboarding`, they are automatically redirected to their dashboard
2. **Enforces Role-Based Access**: Users can only access dashboards that match their selected role
3. **Handles Auth Callback**: Allows access to `/auth/callback` even without an active session (necessary for OAuth redirects)

## Database Schema

The system relies on the `users` table with the following key fields:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  role TEXT, -- NULL = not completed onboarding, TEXT = role selected
  role_selected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## User Flow Examples

### New User (First Time)
1. User signs up/logs in
2. System detects no role in profile
3. User is redirected to `/onboarding`
4. User selects role (e.g., "Developer")
5. `updateUserRole` action updates the database
6. User is redirected to `/dashboard/developer`
7. Future logins will skip onboarding

### Returning User (Completed Onboarding)
1. User logs in
2. System detects existing role in profile
3. User is redirected directly to their dashboard
4. Onboarding screen is never shown

### Attempting to Access Onboarding After Completion
1. User manually navigates to `/onboarding`
2. Middleware detects existing role
3. User is automatically redirected to their dashboard
4. Onboarding page is never displayed

## Key Components

### 1. Login Page (`src/app/login/page.tsx`)
- Handles email/password authentication
- Checks user role status after successful login
- Redirects based on onboarding completion status

### 2. Auth Callback Page (`src/app/auth/callback/page.tsx`)
- Handles OAuth redirects from Google/Microsoft
- Creates user profiles for new OAuth users
- Redirects based on onboarding completion status

### 3. Middleware (`src/middleware.ts`)
- Protects routes based on authentication and role status
- Prevents completed users from accessing onboarding
- Enforces role-based dashboard access

### 4. Onboarding Page (`src/app/onboarding/page.tsx`)
- Allows users to select their role
- Calls `updateUserRole` action to persist selection
- Redirects to appropriate dashboard after completion

### 5. Update Role Action (`src/app/actions/updateRole.ts`)
- Server action that updates user role in database
- Sets `role` and `role_selected_at` fields
- Returns dashboard path for client-side navigation

## Testing the System

### Test New User Flow
1. Create a new account or use an existing account without a role
2. Sign in
3. Verify redirect to `/onboarding`
4. Select a role
5. Verify redirect to dashboard

### Test Returning User Flow
1. Sign in with an account that has already selected a role
2. Verify direct redirect to dashboard (no onboarding)
3. Manually navigate to `/onboarding`
4. Verify automatic redirect to dashboard

### Test SSO Flow
1. Sign in with Google or Microsoft
2. Verify redirect to `/auth/callback`
3. Verify appropriate redirect based on role status

## Troubleshooting

### Common Issues

1. **User stuck in onboarding loop**:
   - Check if `role` field is properly set in database
   - Verify `updateUserRole` action is working correctly

2. **SSO users not being redirected properly**:
   - Check if `/auth/callback` route is accessible
   - Verify OAuth provider configuration in Supabase

3. **Middleware redirects not working**:
   - Check if middleware is properly configured
   - Verify route matchers include all necessary paths

### Debug Steps

1. Check browser console for redirect logs
2. Verify user profile in Supabase dashboard
3. Check middleware logs for route protection
4. Test with different user accounts and roles

## Security Considerations

1. **Role Validation**: Middleware ensures users can only access dashboards matching their role
2. **Session Protection**: All protected routes require valid authentication
3. **Profile Creation**: New OAuth users get profiles created automatically
4. **Redirect Safety**: All redirects are validated and safe

## Future Enhancements

1. **Role Change**: Allow users to change roles after initial selection
2. **Onboarding Reset**: Admin option to reset user onboarding status
3. **Multi-Step Onboarding**: Expand onboarding beyond just role selection
4. **Analytics**: Track onboarding completion rates and user flows
