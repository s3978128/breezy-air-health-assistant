import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'
import { getUserByEmailAndPassword } from './utils/users-data'

export default {
  providers: [
    GitHub,
    Google,
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const { email, password } = credentials

        const user = await getUserByEmailAndPassword(email as string, password as string)

        if (!user) {
          return null
        }

        return user
      },
    }),
  ],
} satisfies NextAuthConfig
