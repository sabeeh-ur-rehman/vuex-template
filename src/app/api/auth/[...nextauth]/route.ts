import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { apiClient } from '@/utils/apiClient'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        tenantCode: { label: 'Tenant Code', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const { token, user } = (await apiClient.post('/auth/login', {
            tenantCode: credentials?.tenantCode,
            email: credentials?.email,
            password: credentials?.password
          })) as any

          if (!token || !user) {
            return null
          }

          return { ...user, token }
        } catch (error) {
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token
      }

      return token
    },
    async session({ session, token }) {
      ;(session as any).accessToken = token.accessToken as string

      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
