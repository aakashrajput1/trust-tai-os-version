# User Approval System

## Overview

The user approval system has been updated to use a simpler and more efficient approach. Instead of using a separate `user_reviews` table, we now use two boolean columns (`isApproved` and `isRejected`) directly in the `users` table.

## Complete User Signup & Approval Flow

### 1. User Signup Process
1. **User visits signup page** (`/signup`)
2. **User fills form** with:
   - Full name
   - Email address
   - Password
   - Role selection (Developer, Project Manager, Sales, etc.)
   - Department (optional)
   - Position (optional)
3. **User submits signup** - account created with `isApproved = false` and `isRejected = false`
4. **User sees success message** - "Your account is pending admin approval"
5. **User redirected to login** after 3 seconds

### 2. Admin Approval Process
1. **Admin visits approvals page** (`/admin/approvals`)
2. **Admin sees pending users** (where both `isApproved` and `isRejected` are `false`)
3. **Admin reviews user details** and clicks "Review" button
4. **Admin approves or rejects** user with optional notes
5. **System updates user status** and sends email notification

### 3. Email Notifications
- **Approved users** receive welcome email with login link
- **Rejected users** receive rejection email with admin notes and contact support link
- **Admin notifications** sent when new users sign up (optional)

## Database Changes

### 1. New Columns Added to Users Table

```sql
-- Add approval columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS isApproved BOOLEAN DEFAULT false;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS isRejected BOOLEAN DEFAULT false;
```

### 2. Default Values
- `isApproved`: `false` (default)
- `isRejected`: `false` (default)

### 3. User States
- **Pending**: `isApproved = false` AND `isRejected = false`
- **Approved**: `isApproved = true` AND `isRejected = false`
- **Rejected**: `isApproved = false` AND `isRejected = true`

## API Endpoints

### GET `/api/admin/users/approve`
Get users pending approval (where both `isApproved` and `isRejected` are `false`)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search by name or email

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    },
    "counts": {
      "pending": 15,
      "approved": 25,
      "rejected": 10,
      "total": 50
    }
  }
}
```

### POST `/api/admin/users/approve`
Approve or reject a user

**Request Body:**
```json
{
  "userId": "user-uuid",
  "action": "approve" | "reject",
  "adminNotes": "Optional notes for rejection"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User approved successfully",
  "data": {
    "userId": "user-uuid",
    "action": "approve",
    "isApproved": true,
    "isRejected": false
  }
}
```

## Frontend Implementation

### User Signup Page: `/signup`
The signup page (`src/app/signup/page.tsx`) includes:
- **Role Selection**: Visual role cards with descriptions
- **Form Validation**: Real-time validation for all fields
- **Success Message**: Clear indication that account is pending approval
- **Auto-redirect**: Redirects to login page after successful signup

### Admin Approvals Page: `/admin/approvals`

The new approvals page (`src/app/admin/approvals/page.tsx`) provides:

1. **Dashboard Cards**: Shows counts for pending, approved, rejected, and total users
2. **Search Functionality**: Search users by name or email
3. **User List**: Display pending users with their details
4. **Approval Modal**: Review user details and approve/reject with optional notes
5. **Pagination**: Handle large numbers of pending users

### Features:
- Real-time status updates
- Admin notes for rejections
- Email notifications (approval/rejection)
- Audit logging for all actions
- Responsive design

### Contact Support Page: `/contact`
A dedicated contact page (`src/app/contact/page.tsx`) for users who need support:
- Contact form for general inquiries
- Support contact information
- FAQ section for common questions
- Links for rejected users to appeal decisions

## Migration Steps

### 1. Run Database Migration
Execute the SQL files in this order:

```bash
# 1. Add new columns to users table
# Run: add-approval-columns.sql

# 2. Drop the old user_reviews table
# Run: drop-user-reviews-table.sql
```

### 2. Update Navigation
The admin layout has been updated to show "Approvals" instead of "Reviews".

### 3. Remove Old Files (Optional)
You can remove these files after migration:
- `src/app/admin/reviews/page.tsx`
- `src/app/api/admin/reviews/route.ts`
- `create-user-reviews-table.sql`

### 4. Email Configuration
The system includes email templates for:
- **Account Approval**: Welcome email with login link
- **Account Rejection**: Rejection email with admin notes and support contact
- **Admin Notifications**: New user signup notifications

Email service is configured in `src/lib/emailService.ts` and templates in `src/lib/emailTemplates.ts`.

## Benefits of New System

### 1. Simplicity
- No separate table needed
- Direct boolean flags for status
- Easier to query and maintain

### 2. Performance
- Faster queries (no joins needed)
- Better indexing options
- Reduced database complexity

### 3. Consistency
- All user data in one place
- Atomic updates
- Better data integrity

### 4. Scalability
- Easier to add new approval states
- Better for large user bases
- More efficient pagination

## Usage Examples

### Get Pending Users
```javascript
const response = await fetch('/api/admin/users/approve?page=1&limit=20')
const data = await response.json()
const pendingUsers = data.data.users
```

### Approve a User
```javascript
const response = await fetch('/api/admin/users/approve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-uuid',
    action: 'approve'
  })
})
```

### Reject a User
```javascript
const response = await fetch('/api/admin/users/approve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-uuid',
    action: 'reject',
    adminNotes: 'User does not meet requirements'
  })
})
```

## Database Queries

### Get Pending Users
```sql
SELECT * FROM users 
WHERE isApproved = false AND isRejected = false 
ORDER BY created_at DESC;
```

### Get Approved Users
```sql
SELECT * FROM users 
WHERE isApproved = true AND isRejected = false;
```

### Get Rejected Users
```sql
SELECT * FROM users 
WHERE isRejected = true;
```

### Update User Approval Status
```sql
-- Approve user
UPDATE users 
SET isApproved = true, isRejected = false, updated_at = NOW() 
WHERE id = 'user-uuid';

-- Reject user
UPDATE users 
SET isApproved = false, isRejected = true, updated_at = NOW() 
WHERE id = 'user-uuid';
```

## Security Considerations

1. **Admin Only Access**: All approval endpoints require admin authentication
2. **Audit Logging**: All approval actions are logged with admin details
3. **Input Validation**: User IDs and actions are validated
4. **Email Confirmation**: Approved users have their emails confirmed automatically

## Future Enhancements

1. **Bulk Operations**: Approve/reject multiple users at once
2. **Approval Workflows**: Multi-level approval process
3. **Auto-approval Rules**: Automatic approval based on criteria
4. **Approval History**: Track all approval/rejection actions
5. **Email Templates**: Customizable approval/rejection emails

## Troubleshooting

### Common Issues

1. **Users not showing as pending**
   - Check if `isApproved` and `isRejected` are both `false`
   - Verify the user exists in the `users` table

2. **Approval action fails**
   - Check if user is already approved/rejected
   - Verify admin permissions
   - Check database connection

3. **Email not sent**
   - Check email service configuration
   - Verify user email is valid
   - Check server logs for email errors

### Debug Queries

```sql
-- Check user approval status
SELECT id, name, email, isApproved, isRejected, created_at 
FROM users 
WHERE email = 'user@example.com';

-- Check all pending users
SELECT COUNT(*) as pending_count 
FROM users 
WHERE isApproved = false AND isRejected = false;

-- Check approval distribution
SELECT 
  SUM(CASE WHEN isApproved = false AND isRejected = false THEN 1 ELSE 0 END) as pending,
  SUM(CASE WHEN isApproved = true THEN 1 ELSE 0 END) as approved,
  SUM(CASE WHEN isRejected = true THEN 1 ELSE 0 END) as rejected
FROM users;
```
