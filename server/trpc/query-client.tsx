'use client'

import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createQueryClient, getUrl, transformer } from './shared'
import { QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { createTRPCReact } from '@trpc/react-query'
import { SessionProvider } from 'next-auth/react'
import type { AppRouter } from 'server/routers'
import { useState } from 'react'
export const api = createTRPCReact<AppRouter>()

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient())
  }
}

export function TRPCProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer,
          url: getUrl(),
          headers: { 'x-trpc-source': 'react-query' },
        }),
      ],
    })
  )

  return (
    <SessionProvider>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {props.children}
          <ReactQueryDevtools />
        </QueryClientProvider>
      </api.Provider>
    </SessionProvider>
  )
}
