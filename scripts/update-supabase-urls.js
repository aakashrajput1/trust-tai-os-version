#!/usr/bin/env node

/**
 * Supabase URL Configuration Script
 * 
 * This script helps you update your Supabase email templates
 * to use the correct Vercel deployment URL.
 * 
 * Usage: node scripts/update-supabase-urls.js
 */

console.log('🔧 Supabase Email Template Configuration');
console.log('=======================================\n');

console.log('📧 Email Template URLs to Update in Supabase:');
console.log('=============================================\n');

console.log('1. Go to your Supabase Dashboard:');
console.log('   https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]\n');

console.log('2. Navigate to: Authentication > Email Templates\n');

console.log('3. Update the following templates:\n');

console.log('📨 Confirm signup template:');
console.log('   Subject: Confirm your email address - Trust TAI OS');
console.log('   Content:');
console.log('   ================================================');
console.log('   <h2>Welcome to Trust TAI OS!</h2>');
console.log('   <p>Thank you for signing up. Please confirm your email address by clicking the button below:</p>');
console.log('   <a href="https://trust-tai-os-version.vercel.app/auth/callback?token={{ .Token }}&type=email_confirmation" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Confirm Email Address</a>');
console.log('   <p>If the button doesn\'t work, copy and paste this link:</p>');
console.log('   <p>https://trust-tai-os-version.vercel.app/auth/callback?token={{ .Token }}&type=email_confirmation</p>');
console.log('   <p>This link will expire in 24 hours.</p>\n');

console.log('🔑 Reset password template:');
console.log('   Subject: Reset your password - Trust TAI OS');
console.log('   Content:');
console.log('   ================================================');
console.log('   <h2>Password Reset Request</h2>');
console.log('   <p>We received a request to reset your password. Click the button below to create a new password:</p>');
console.log('   <a href="https://trust-tai-os-version.vercel.app/auth/callback?token={{ .Token }}&type=password_reset" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>');
console.log('   <p>If the button doesn\'t work, copy and paste this link:</p>');
console.log('   <p>https://trust-tai-os-version.vercel.app/auth/callback?token={{ .Token }}&type=password_reset</p>');
console.log('   <p>This link will expire in 1 hour.</p>\n');

console.log('🔗 Magic link template:');
console.log('   Subject: Sign in to Trust TAI OS');
console.log('   Content:');
console.log('   ================================================');
console.log('   <h2>Sign in to Trust TAI OS</h2>');
console.log('   <p>You requested a magic link to sign in. Click the button below:</p>');
console.log('   <a href="https://trust-tai-os-version.vercel.app/auth/callback?token={{ .Token }}&type=magic_link" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Sign in to Trust TAI OS</a>');
console.log('   <p>If the button doesn\'t work, copy and paste this link:</p>');
console.log('   <p>https://trust-tai-os-version.vercel.app/auth/callback?token={{ .Token }}&type=magic_link</p>');
console.log('   <p>This link will expire in 1 hour.</p>\n');

console.log('4. URL Configuration:');
console.log('   Go to: Authentication > URL Configuration');
console.log('   Set Site URL to: https://trust-tai-os-version.vercel.app');
console.log('   Add these Redirect URLs:');
console.log('   - https://trust-tai-os-version.vercel.app/auth/callback');
console.log('   - https://trust-tai-os-version.vercel.app/dashboard');
console.log('   - https://trust-tai-os-version.vercel.app/onboarding');
console.log('   - https://trust-tai-os-version.vercel.app/login\n');

console.log('5. Test the configuration:');
console.log('   - Go to https://trust-tai-os-version.vercel.app/onboarding');
console.log('   - Create a new account');
console.log('   - Check your email for the confirmation link');
console.log('   - Click the link - it should redirect to your Vercel deployment\n');

console.log('⚠️  Important Notes:');
console.log('   - Make sure to save the templates after updating');
console.log('   - The {{ .Token }} placeholder will be replaced with the actual token');
console.log('   - Test with a real email address to verify the links work correctly');
console.log('   - If you\'re using a custom domain, replace the Vercel URL with your domain\n');

console.log('✅ Configuration complete!');





