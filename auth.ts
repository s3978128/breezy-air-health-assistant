import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { getUserByEmailAndProvider } from './utils/users-data'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user, account }) {
      const { name, email } = user
      let existedUser: any
      try {
        if ((account?.provider === 'google' || account?.provider === 'github') && user) {
          const provider = account.provider
          existedUser = await getUserByEmailAndProvider(email as string, provider)

          if (!existedUser) {
            const res = await fetch('http://localhost:3000/api/user/userLoginExternal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email, provider }),
            })
            if (!res.ok) throw new Error('Failed to create external account user')
            existedUser = await getUserByEmailAndProvider(email as string, provider)
          }

          ;(user as any).customUser = existedUser
        } else {
          // Handle credentials provider
          existedUser = await getUserByEmailAndProvider(email as string, 'credentials')
          ;(user as any).customUser = existedUser
        }
      } catch (error) {
        console.error('SignIn error:', error)
        return false
      }
      return true
    },

    async jwt({ token, user }) {
      if (user && (user as any).customUser) {
        const customUser = (user as any).customUser
        return {
          ...token,
          id: customUser.id,
        }
      }
      return token
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      }
    },
  },
})
