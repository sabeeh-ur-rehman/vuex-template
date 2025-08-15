// Next Imports

import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

import { getServerSession } from 'next-auth'

// Component Imports
import Login from '@views/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const LoginPage = async () => {

  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  const mode = await getServerMode()

  return <Login mode={mode} />
}

export default LoginPage
