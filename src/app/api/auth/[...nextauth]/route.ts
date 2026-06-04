import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getUserByEmail, createUser } from '@/lib/static-data'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'البريد الإلكتروني', type: 'email' },
        password: { label: 'كلمة المرور', type: 'password' },
        name: { label: 'الاسم', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        // Sign in existing user
        const existingUser = getUserByEmail(credentials.email)
        if (existingUser) {
          return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            image: existingUser.image,
            role: existingUser.role,
          }
        }

        // Sign up new user (if name is provided, treat as registration)
        if (credentials.name) {
          const result = createUser({
            name: credentials.name,
            email: credentials.email,
          })

          if ('error' in result) return null

          return {
            id: result.id,
            name: result.name,
            email: result.email,
            image: result.image,
            role: result.role,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'student'
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        ;(session.user as any).id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
