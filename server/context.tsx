import { experimental_createServerActionHandler } from '@trpc/next/app-dir/server'
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { initTRPC, TRPCError } from '@trpc/server'
import { headers } from 'next/headers'
import { db } from 'server/db/prisma'
import { ZodError } from 'zod'

import { transformer } from './trpc/shared'
import { auth } from './db/auth'

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const session = await auth()
  return {
    session,
    db,
    headers: opts && Object.fromEntries(opts.req.headers),
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter(opts) {
    const { shape, error } = opts
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    }
  },
})

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory
export const router = t.router
export const mergeRouters = t.mergeRouters

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure

/** Reusable middleware that enforces users are logged in before running the procedure. */

const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx,
  })
})

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceAuth)

export const createAction = experimental_createServerActionHandler(t, {
  async createContext() {
    const session = await auth()

    return {
      db,
      session,
      headers: {
        // Pass the cookie header to the API
        cookies: (await headers()).get('cookie') ?? '',
      },
    }
  },
})
