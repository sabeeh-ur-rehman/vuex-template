import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
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
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
              tenantId: credentials?.tenantId
            })
          })

          if (!res.ok) {
            return null
          }

          const data = await res.json()
          const { id, name, email, token } = data

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
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
