import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { apiClient } from '@/utils/apiClient'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        tenantId: { label: 'Tenant ID', type: 'text' },
        userId: { label: 'User ID', type: 'text' }
      },
      async authorize(credentials) {
        try {
          const { token } = (await apiClient.post('/auth/login', {
            tenantId: credentials?.tenantId,
            userId: credentials?.userId
          })) as any

          if (!token) {
            return null
          }

          let user: any

          try {
            user = await apiClient.get(`/users/${credentials?.userId}`)
          } catch {
            user = { id: credentials?.userId }
          }

          const { id, name, email } = user as any

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
