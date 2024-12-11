'use client'

import {
  experimental_createActionHook,
  experimental_createTRPCNextAppDirClient,
  experimental_serverActionLink,
} from '@trpc/next/app-dir/client'
import { experimental_nextHttpLink } from '@trpc/next/app-dir/links/nextHttp'
import { getUrl, transformer } from './shared'
import { AppRouter } from 'server/routers'
import { loggerLink } from '@trpc/client'

export const api = experimental_createTRPCNextAppDirClient<AppRouter>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: (op) => true,
        }),
        experimental_nextHttpLink({
          transformer,
          batch: true,
          url: getUrl(),
          headers() {
            return {
              'x-trpc-source': 'client',
            }
          },
        }),
      ],
    }
  },
})

export const useAction = experimental_createActionHook<AppRouter>({
  links: [
    loggerLink(),
    experimental_serverActionLink({
      transformer,
    }),
  ],
})
