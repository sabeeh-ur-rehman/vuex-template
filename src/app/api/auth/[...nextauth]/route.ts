import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (credentials?.email) {
          return { id: '1', name: credentials.email, email: credentials.email }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
