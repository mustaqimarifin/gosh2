import { createHydrationHelpers } from '@trpc/react-query/rsc'
import 'server-only'

import { createCallerFactory, type Context } from 'server/context'
import { createQueryClient } from './shared'
import { appRouter } from 'server/routers'
import { headers } from 'next/headers'
import { db } from 'server/db/prisma'
import { auth } from 'server/db/auth'
import { cache } from 'react'

const createContext = cache(async (): Promise<Context> => {
  const _headers = new Headers(await headers())
  _headers.set('x-trpc-source', 'rsc')

  return {
    headers: Object.fromEntries(_headers),
    session: await auth(),
    db,
  }
})

/**
 * Create a stable getter for the query client that
 * will return the same client during the same request.
 */
const getQueryClient = cache(createQueryClient)
const caller = createCallerFactory(appRouter)(createContext)

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
)
