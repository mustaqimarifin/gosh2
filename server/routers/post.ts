import { protectedProcedure, publicProcedure, router } from 'server/context'
import { TRPCError } from '@trpc/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const scrape = Prisma.validator<Prisma.PostSelect>()({
  slug: true,
  _count: {
    select: { comments: true },
  },
  comments: {
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      text: true,
      parentId: true,
      createdAt: true,
      reactions: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          level: true,
        },
      },
      _count: { select: { likes: true } },
    },
  },
})

export const postRouter = router({
  getCommentByID: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const comment = await ctx.db.comment.findUnique({
        where: input,
      })
      return comment?.id
    }),
  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: input,
        select: scrape,
      })
      const likes = await ctx.db.like.findMany({
        where: {
          userId: ctx.session?.user?.id,
          commentId: {
            in: post?.comments.map((comment) => comment?.id),
          },
        },
      })
      return {
        ...post,
        comments: post?.comments.map((comment) => {
          const { _count, ...commentFields } = comment
          return {
            ...commentFields,
            likedByMe: !!likes.find(
              (like) =>
                like.commentId === comment.id &&
                like.userId === ctx.session?.user?.id
            ),
            likeCount: _count.likes,
          }
        }),
      }
    }),
  viewsBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const views = await ctx.db.post.findMany({
        where: input,
        select: {
          //slug: true,
          count: true,
        },
      })
      //console.log(views)
      //const x = views[0].count //views[0].count /*  views?.forEach((x) => {
      //if (x.count === null) return null
      //if (x.count > 1) return x.count

      return views
    }),
  totalViews: publicProcedure.query(async ({ ctx }) => {
    const total = await ctx.db.post.aggregate({
      _sum: {
        count: true,
      },
    })
    return total._sum.count
  }),
  addViewCount: publicProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const total = await ctx.db.post.upsert({
        where: input,
        create: input,
        update: {
          count: {
            increment: 1,
          },
        },
      })

      /*       if (total?.count < 1) return null
      total = await ctx.db.post.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          count: true,
        },
      }) */
      return { total }
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany()
  }),
  commentCount: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.comment.count({ where: { slug: input.slug } })
    }),
  addComment: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        parentId: z.number().optional(),
        text: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.post.findUnique({
        where: { slug: input.slug },
      })
      return await ctx.db.comment
        .create({
          data: {
            slug: input.slug,
            text: input.text,
            parentId: input.parentId,
            userId: ctx.session!.user.id,
            createdAt: new Date(),
          },
          select: {
            slug: true,
          },
        })
        .then((comment) => {
          return {
            ...comment,
            likeCount: 0,
            likedByMe: false,
          }
        })
    }),

  updateComment: protectedProcedure
    .input(
      z.object({
        commentId: z.number(),
        text: z.string(),
        updatedAt: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.db.comment.findUnique({
        where: { id: input.commentId },
        select: { userId: true },
      })

      if (res?.userId !== ctx.session!.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You do not have permission to update this comment',
        })
      }

      return await ctx.db.comment.update({
        where: {
          id: input.commentId,
        },
        data: {
          text: input.text,
          updatedAt: new Date(),
        },
      })
    }),
  deleteComment: protectedProcedure
    .input(
      z.object({
        commentId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.db.comment.findUnique({
        where: { id: input.commentId },
        select: { userId: true },
      })
      if (res?.userId !== ctx.session?.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You do not have permission to delete this comment',
        })
      }

      return await ctx.db.comment.delete({
        where: {
          id: input.commentId,
        },
      })
    }),
  toggleLike: protectedProcedure
    .input(
      z.object({
        commentId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.comment.findUnique({
        where: { id: input.commentId },
        select: { userId: true },
      })
      const like = await ctx.db.like.findUnique({
        where: {
          userId_commentId: {
            commentId: input.commentId,
            userId: ctx.session!.user.id,
          },
        },
      })

      if (like === null) {
        return await ctx.db.like
          .create({
            data: {
              commentId: input.commentId,
              userId: ctx.session!.user.id,
            },
          })
          .then(() => {
            return { addLike: true }
          })
      } else {
        return await ctx.db.like
          .delete({
            where: {
              userId_commentId: {
                commentId: input.commentId,
                userId: ctx.session!.user.id,
              },
            },
          })
          .then(() => {
            return { addLike: false }
          })
      }
    }),

  getReactions: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.reaction.findMany({
      orderBy: { type: 'asc' },
    })
  }),
  getReaction: publicProcedure
    .input(
      z.object({
        type: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.reaction.findUnique({
        where: input,
      })
    }),
  getCommentReactions: publicProcedure
    .input(
      z.object({
        reactionType: z.string(),
        commentId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.commentReaction.findUnique({
        where: {
          userId_commentId_reactionType: {
            commentId: input.commentId,
            userId: ctx.session!.user.id,
            reactionType: input.reactionType,
          },
        },
      })
    }),
  addCommentReaction: protectedProcedure
    .input(
      z.object({
        reactionType: z.string(),
        commentId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.comment.findUnique({
        where: { id: input.commentId },
      })
      const res = await ctx.db.commentReaction.create({
        data: {
          reactionType: input.reactionType,
          commentId: input.commentId,
          userId: ctx.session!.user.id,
        },
      })
      return res
    }),
  deleteCommentReaction: protectedProcedure
    .input(
      z.object({
        reactionType: z.string(),
        commentId: z.number(),
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.db.commentReaction.findUnique({
        where: {
          userId_commentId_reactionType: {
            commentId: input.commentId,
            userId: ctx.session!.user.id,
            reactionType: input.reactionType,
          },
        },
      })
      if (res?.userId !== ctx.session?.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You do not have permission to delete this comment',
        })
      }

      return await ctx.db.commentReaction.delete({
        where: {
          id: input.id,
        },
      })
    }),

  /* const getReactions = async (): Promise<Reaction[]> => {
  const query = supabase
    .from<Reaction>('sce_reactions')
    .select('*')
    .order('type', { ascending: true });

  const response = await query;
  assertResponseOk(response);
  return response.data as Reaction[];
};
 */
  /* const getReaction = async (type: string): Promise<Reaction> => {
  const query = supabase
    .from<Reaction>('sce_reactions')
    .select('*')
    .eq('type', type)
    .single();

  const response = await query;
  assertResponseOk(response);
  return response.data as Reaction;
}; */
})
