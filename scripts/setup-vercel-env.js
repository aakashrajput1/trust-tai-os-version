#!/usr/bin/env node

/**
 * Vercel Environment Variables Setup Script
 * 
 * This script helps you set up the required environment variables in Vercel
 * for email confirmations to work with your deployment URL.
 * 
 * Usage: node scripts/setup-vercel-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Trust TAI OS - Vercel Environment Setup');
console.log('==========================================\n');

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envLocalPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create a .env.local file with your configuration.\n');
  
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copy env.example to .env.local and update the values:');
    console.log('cp env.example .env.local\n');
  }
} else {
  console.log('✅ .env.local file found');
  
  // Read and display current configuration
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const lines = envContent.split('\n');
  
  console.log('\n📋 Current .env.local configuration:');
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        const displayValue = key.includes('KEY') || key.includes('SECRET') 
          ? value.substring(0, 10) + '...' 
          : value;
        console.log(`   ${key}=${displayValue}`);
      }
    }
  });
}

console.log('\n🔧 Required Vercel Environment Variables:');
console.log('==========================================');
console.log('NEXT_PUBLIC_APP_URL=https://trust-tai-os-version.vercel.app');
console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
console.log('EMAIL_PROVIDER=mock');

console.log('\n📝 Instructions:');
console.log('1. Go to your Vercel project dashboard');
console.log('2. Navigate to Settings > Environment Variables');
console.log('3. Add each variable above with the correct values');
console.log('4. Redeploy your application');

console.log('\n🔗 Supabase Configuration:');
console.log('1. Go to your Supabase dashboard');
console.log('2. Navigate to Authentication > URL Configuration');
console.log('3. Set Site URL to: https://trust-tai-os-version.vercel.app');
console.log('4. Add redirect URLs:');
console.log('   - https://trust-tai-os-version.vercel.app/auth/callback');
console.log('   - https://trust-tai-os-version.vercel.app/dashboard');
console.log('   - https://trust-tai-os-version.vercel.app/onboarding');

console.log('\n✅ After setup, test email confirmations:');
console.log('1. Go to https://trust-tai-os-version.vercel.app/onboarding');
console.log('2. Create a new account');
console.log('3. Check your email for the confirmation link');
console.log('4. Click the link - it should redirect to your Vercel deployment');

console.log('\n📚 For more details, see EMAIL_SETUP.md');
console.log('\n🎉 Setup complete!');
