import { protectedProcedure, publicProcedure, router } from 'server/context'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const scrape = Prisma.validator<Prisma.HotlineSelect>()({
  id: true,
  text: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
})

export const hotRouter = router({
  getHot: publicProcedure.query(async (opts) => {
    const entries = await opts.ctx.db.hotline.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
    return entries
  }),
  addHot: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const entry = await ctx.db.hotline.create({
        data: {
          text: input.text,
          userId: ctx.session!.user.id,
          createdAt: new Date(),
        },
      })
      return {
        entry,
      }
    }),
})
