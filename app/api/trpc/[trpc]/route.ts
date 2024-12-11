import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from 'server/context'
import { appRouter } from 'server/routers'

// this is the server RPC API handler

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  })

export { handler as GET, handler as POST }