# 🔧 Admin Panel Setup & Troubleshooting

## 🚨 **Issue: Admin Panel Stuck on Loading**

The admin panel is currently stuck on the loading screen because:
1. No admin user exists in the database
2. The admin login API was missing
3. Middleware wasn't properly configured for admin routes

## ✅ **Fixes Applied:**

### 1. **Created Admin Login API** (`/api/admin/login`)
- Handles admin authentication
- Checks user role and status
- Returns admin session data

### 2. **Updated Middleware** (`src/middleware.ts`)
- Added proper admin route protection
- Allows access to `/admin/login`
- Protects other admin routes

### 3. **Added Debugging** 
- Console logs in admin layout
- Console logs in admin login page
- Better error handling

## 🚀 **How to Fix:**

### **Step 1: Create Admin User**
Run this script to create an admin user:

```bash
node scripts/create-admin-user.js
```

**Default Admin Credentials:**
- Email: `admin@trusttai.com`
- Password: `admin123456`

### **Step 2: Test Admin Login**
1. Go to `/admin/login`
2. Use the credentials above
3. Check browser console for debug logs

### **Step 3: Verify Admin Panel**
After successful login, you should be redirected to `/admin/dashboard`

## 🔍 **Debugging Steps:**

### **Check Browser Console:**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Navigate to `/admin/login`
4. Look for debug messages

### **Expected Console Output:**
```
Checking admin user...
No admin data found, redirecting to login
```

### **After Login Attempt:**
```
Attempting admin login with: {email: "...", password: "..."}
Login response status: 200
Login response data: {success: true, admin: {...}}
Login successful, storing admin data: {...}
Redirecting to admin dashboard...
```

## 🐛 **Common Issues & Solutions:**

### **Issue 1: "No admin data found"**
- **Cause**: No admin user in database
- **Solution**: Run the create-admin-user script

### **Issue 2: "Access denied. Admin role required"**
- **Cause**: User exists but doesn't have Admin role
- **Solution**: Update user role in database to 'Admin'

### **Issue 3: "Account is not active"**
- **Cause**: User exists but status is not 'active'
- **Solution**: Update user status to 'active' in database

### **Issue 4: Middleware redirects to dashboard**
- **Cause**: Middleware not properly configured
- **Solution**: Ensure middleware.ts includes admin routes

## 📋 **Database Requirements:**

Make sure your `users` table has these columns:
- `id` (UUID, primary key)
- `name` (text)
- `email` (text, unique)
- `role` (text, should be 'Admin')
- `status` (text, should be 'active')
- `mfa_enabled` (boolean)
- `lastActive` (timestamp)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## 🔐 **Environment Variables:**

Ensure these are set in your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 🎯 **Testing Checklist:**

- [ ] Admin user created successfully
- [ ] Can access `/admin/login` page
- [ ] Login form submits without errors
- [ ] Console shows successful login
- [ ] Redirected to `/admin/dashboard`
- [ ] Admin panel loads completely
- [ ] No more loading spinner

## 🆘 **Still Having Issues?**

1. **Check browser console** for error messages
2. **Verify database** has admin user with correct role
3. **Check environment variables** are set correctly
4. **Restart development server** after changes
5. **Clear browser cache** and localStorage

## 📞 **Support:**

If you're still experiencing issues, check:
1. Browser console errors
2. Network tab for failed API calls
3. Database user table structure
4. Environment variable configuration



