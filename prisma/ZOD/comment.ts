import {
  CompletePost,
  relatedPostSchema,
  CompleteUser,
  relatedUserSchema,
  CompleteCommentReaction,
  relatedCommentReactionSchema,
  CompleteLike,
  relatedLikeSchema,
} from './index'
import * as z from 'zod'

export const commentSchema = z.object({
  id: z.number().int(),
  text: z.string().max(10000),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  userId: z.string().nullish(),
  parentId: z.number().int().nullish(),
  slug: z.string().nullish(),
})

export interface CompleteComment extends z.infer<typeof commentSchema> {
  parent?: CompleteComment | null
  replies: CompleteComment[]
  post?: CompletePost | null
  user?: CompleteUser | null
  reactions: CompleteCommentReaction[]
  likes: CompleteLike[]
}

/**
 * relatedCommentSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCommentSchema: z.ZodSchema<CompleteComment> = z.lazy(() =>
  commentSchema.extend({
    parent: relatedCommentSchema.nullish(),
    replies: relatedCommentSchema.array(),
    post: relatedPostSchema.nullish(),
    user: relatedUserSchema.nullish(),
    reactions: relatedCommentReactionSchema.array(),
    likes: relatedLikeSchema.array(),
  })
)
