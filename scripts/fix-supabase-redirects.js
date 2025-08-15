#!/usr/bin/env node

/**
 * Fix Supabase Redirect URLs Script
 * 
 * This script helps you fix the Supabase configuration that's causing
 * email confirmations to redirect to localhost instead of your Vercel URL.
 * 
 * Usage: node scripts/fix-supabase-redirects.js
 */

console.log('🔧 Fixing Supabase Redirect URLs');
console.log('================================\n');

console.log('🚨 PROBLEM: Emails are redirecting to localhost instead of Vercel');
console.log('✅ SOLUTION: Update Supabase URL Configuration\n');

console.log('📋 STEP-BY-STEP FIX:\n');

console.log('1️⃣  Go to your Supabase Dashboard:');
console.log('   https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]\n');

console.log('2️⃣  Navigate to: Authentication > URL Configuration\n');

console.log('3️⃣  UPDATE THESE SETTINGS:\n');

console.log('   🔗 Site URL:');
console.log('      OLD: http://localhost:3000 (or similar)');
console.log('      NEW: https://trust-tai-os-version.vercel.app\n');

console.log('   🔄 Redirect URLs:');
console.log('      REMOVE: http://localhost:3000/*');
console.log('      ADD:');
console.log('         - https://trust-tai-os-version.vercel.app/auth/callback');
console.log('         - https://trust-tai-os-version.vercel.app/dashboard');
console.log('         - https://trust-tai-os-version.vercel.app/onboarding');
console.log('         - https://trust-tai-os-version.vercel.app/login');
console.log('         - https://trust-tai-os-version.vercel.app\n');

console.log('4️⃣  SAVE THE CHANGES\n');

console.log('5️⃣  UPDATE EMAIL TEMPLATES:\n');

console.log('   📧 Go to: Authentication > Email Templates\n');

console.log('   📨 Confirm signup template:');
console.log('      Replace any localhost URLs with:');
console.log('      https://trust-tai-os-version.vercel.app/auth/callback?token={{ .Token }}&type=email_confirmation\n');

console.log('   🔑 Reset password template:');
console.log('      Replace any localhost URLs with:');
console.log('      https://trust-tai-os-version.vercel.app/auth/callback?token={{ .Token }}&type=password_reset\n');

console.log('   🔗 Magic link template:');
console.log('      Replace any localhost URLs with:');
console.log('      https://trust-tai-os-version.vercel.app/auth/callback?token={{ .Token }}&type=magic_link\n');

console.log('6️⃣  TEST IMMEDIATELY:\n');

console.log('   ✅ Go to: https://trust-tai-os-version.vercel.app/onboarding');
console.log('   ✅ Create a new account');
console.log('   ✅ Check your email');
console.log('   ✅ Click the confirmation link');
console.log('   ✅ Should redirect to Vercel deployment!\n');

console.log('⚠️  IMPORTANT NOTES:\n');

console.log('   • Make sure to SAVE all changes in Supabase');
console.log('   • The changes take effect immediately');
console.log('   • Test with a real email address');
console.log('   • Clear browser cache if needed');
console.log('   • If using custom domain, replace Vercel URL with your domain\n');

console.log('🔍 TROUBLESHOOTING:\n');

console.log('   If still not working:');
console.log('   1. Check if there are any cached redirect URLs');
console.log('   2. Verify the Site URL is exactly: https://trust-tai-os-version.vercel.app');
console.log('   3. Make sure all old localhost URLs are removed');
console.log('   4. Try creating a new account to test\n');

console.log('🎯 QUICK CHECKLIST:\n');

console.log('   ☐ Site URL updated to Vercel URL');
console.log('   ☐ All localhost redirect URLs removed');
console.log('   ☐ Vercel redirect URLs added');
console.log('   ☐ Email templates updated');
console.log('   ☐ Changes saved in Supabase');
console.log('   ☐ Tested with new account\n');

console.log('✅ After completing these steps, emails will redirect to your Vercel deployment!');












