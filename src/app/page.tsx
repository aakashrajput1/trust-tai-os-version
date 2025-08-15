import { redirect } from 'next/navigation'
import { redirectIfLoggedIn } from '@/lib/auth'

export default async function HomePage() {
  const redirectPath = await redirectIfLoggedIn()
  
  if (redirectPath) {
    redirect(redirectPath)
  }
  
  redirect('/login')
} 