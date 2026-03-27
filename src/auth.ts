import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { authenticateUser, registerUser } from './lib/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Check if this is a registration request (username provided)
        if (credentials.username) {
          try {
            await registerUser(
              credentials.username as string,
              credentials.email as string,
              credentials.password as string
            )
            // After registration, authenticate the user
            return await authenticateUser(
              credentials.email as string,
              credentials.password as string
            )
          } catch (error) {
            console.error('Registration error:', error)
            return null
          }
        }

        // Login request
        const user = await authenticateUser(
          credentials.email as string,
          credentials.password as string
        )

        return user
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  }
})
