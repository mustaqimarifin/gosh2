import type { User as PrismaUser, UserRole } from '@prisma/client'
import NextAuth, { Session, type DefaultSession } from 'next-auth'
//type UserRole = 'USER' | 'BLOCKED' | 'ADMIN'
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** HOKAGE */
      id: string
      role: UserRole
    } & DefaultSession['user']
    isAdmin: boolean
    userId: string
  }

  interface User extends PrismaUser {}
}
