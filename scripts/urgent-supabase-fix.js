#!/usr/bin/env node

/**
 * URGENT: Fix Supabase Email Redirect Issue
 * 
 * PROBLEM: Email URLs are redirecting to localhost:3000 instead of Vercel
 * SOLUTION: Update Supabase Site URL and Redirect URLs
 * 
 * Usage: node scripts/urgent-supabase-fix.js
 */

console.log('🚨 URGENT: Fix Supabase Email Redirect Issue');
console.log('===========================================\n');

console.log('🔍 PROBLEM IDENTIFIED:');
console.log('   Email URL: https://zmacbmasjgknxcyrytvz.supabase.co/auth/v1/verify?token=...&redirect_to=http://localhost:3000/onboarding');
console.log('   ❌ Still redirecting to: http://localhost:3000/onboarding');
console.log('   ✅ Should redirect to: https://trust-tai-os-version.vercel.app/onboarding\n');

console.log('🔧 IMMEDIATE FIX REQUIRED:\n');

console.log('1️⃣  GO TO SUPABASE DASHBOARD:');
console.log('   https://supabase.com/dashboard/project/zmacbmasjgknxcyrytvz\n');

console.log('2️⃣  NAVIGATE TO: Authentication > URL Configuration\n');

console.log('3️⃣  CRITICAL CHANGES:\n');

console.log('   🔗 SITE URL:');
console.log('      CURRENT: http://localhost:3000 (or similar)');
console.log('      CHANGE TO: https://trust-tai-os-version.vercel.app');
console.log('      ⚠️  This is the MOST IMPORTANT setting!\n');

console.log('   🔄 REDIRECT URLS:');
console.log('      REMOVE: http://localhost:3000/*');
console.log('      REMOVE: http://localhost:3000/onboarding');
console.log('      ADD:');
console.log('         - https://trust-tai-os-version.vercel.app');
console.log('         - https://trust-tai-os-version.vercel.app/onboarding');
console.log('         - https://trust-tai-os-version.vercel.app/auth/callback');
console.log('         - https://trust-tai-os-version.vercel.app/dashboard');
console.log('         - https://trust-tai-os-version.vercel.app/login\n');

console.log('4️⃣  SAVE THE CHANGES\n');

console.log('5️⃣  TEST IMMEDIATELY:');
console.log('   - Go to: https://trust-tai-os-version.vercel.app/onboarding');
console.log('   - Create a new account');
console.log('   - Check email');
console.log('   - New email URL should be:');
console.log('     https://zmacbmasjgknxcyrytvz.supabase.co/auth/v1/verify?token=...&redirect_to=https://trust-tai-os-version.vercel.app/onboarding\n');

console.log('⚠️  WHY THIS HAPPENS:');
console.log('   • Supabase uses the Site URL to generate email redirects');
console.log('   • If Site URL is localhost, all emails redirect to localhost');
console.log('   • This setting overrides everything else');
console.log('   • Must be changed in Supabase dashboard\n');

console.log('🎯 EXACT STEPS:');
console.log('   1. Open Supabase dashboard');
console.log('   2. Go to Authentication > URL Configuration');
console.log('   3. Change Site URL to: https://trust-tai-os-version.vercel.app');
console.log('   4. Remove all localhost redirect URLs');
console.log('   5. Add Vercel redirect URLs');
console.log('   6. Save changes');
console.log('   7. Test with new account\n');

console.log('✅ AFTER FIX:');
console.log('   Email URLs will be:');
console.log('   https://zmacbmasjgknxcyrytvz.supabase.co/auth/v1/verify?token=...&redirect_to=https://trust-tai-os-version.vercel.app/onboarding\n');

console.log('🚀 DO THIS NOW AND TEST!');




