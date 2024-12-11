import { experimental_createTRPCNextAppDirServer } from '@trpc/next/app-dir/server'
import { experimental_nextCacheLink } from '@trpc/next/app-dir/links/nextCache'
import { loggerLink } from '@trpc/client'
import { db } from 'server/db/prisma'

import { appRouter } from 'server/routers'
import { cookies } from 'next/headers'
import { transformer } from './shared'
import { auth } from 'server/db/auth'

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 */
export const api = experimental_createTRPCNextAppDirServer<typeof appRouter>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: (op) => true,
        }),
        experimental_nextCacheLink({
          // requests are cached for 5 seconds
          revalidate: 5,
          router: appRouter,
          transformer,
          createContext: async () => {
            return {
              db,
              session: await auth(),
              headers: {
                cookie: (await cookies()).toString(),
                'x-trpc-source': 'rsc-invoke',
              },
            }
          },
        }),
      ],
    }
  },
})
