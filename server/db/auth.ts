import { PrismaAdapter } from '@auth/prisma-adapter'
import Twitter from 'next-auth/providers/twitter'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { db } from 'server/db/prisma'
import NextAuth from 'next-auth'
import { cache } from 'react'

export const { auth: uncachedAuth, handlers } = NextAuth({
  //debug: true,
  adapter: PrismaAdapter(db) as any,
  providers: [GitHub, Google, Twitter],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async session({ session, user }) {
      session.user.id = user.id
      //session.user.role = user.role
      return session
    },
  },
  /*   pages: {
    signIn: "/sign-in",
  }, */
})

export const auth = cache(uncachedAuth)
