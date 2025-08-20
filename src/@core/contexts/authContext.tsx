'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

import { useRouter } from 'next/navigation'

import { apiClient } from '@/utils/apiClient'

type AuthContextType = {
  user: any
  login: (data: { email: string; password: string; tenantCode: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {}
})

export const AuthProvider = ({ children, initialUser }: { children: ReactNode; initialUser?: any }) => {
  const [user, setUser] = useState<any>(initialUser ?? null)
  const router = useRouter()

  const login = async (data: { email: string; password: string; tenantCode: string }) => {
    const res = await apiClient.post<{ token: string; user: any }>('/auth/login', data)

    // Store token for subsequent authenticated requests
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', res.token)
      document.cookie = `access_token=${res.token}; path=/`
    }

    setUser(res.user)
    router.push('/home')
  }

  const logout = () => {
    // Remove stored token on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }

    setUser(null)
    router.push('/login')
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
