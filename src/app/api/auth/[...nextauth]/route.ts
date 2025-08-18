import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { apiClient } from '@/utils/apiClient'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        tenantId: { label: 'Tenant ID', type: 'text' }
      },
      async authorize(credentials) {
        try {
          const data = await apiClient.post('/auth/login', {
            email: credentials?.email,
            password: credentials?.password,
            tenantId: credentials?.tenantId
          })

          const { id, name, email, token } = data as any

          if (!id || !email || !token) {
            return null
          }

          return { id, name, email, token }
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
