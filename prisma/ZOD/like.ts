import {
  CompleteComment,
  relatedCommentSchema,
  CompleteUser,
  relatedUserSchema,
} from './index'
import * as z from 'zod'

export const likeSchema = z.object({
  userId: z.string(),
  commentId: z.number().int(),
})

export interface CompleteLike extends z.infer<typeof likeSchema> {
  comment: CompleteComment
  user: CompleteUser
}

/**
 * relatedLikeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedLikeSchema: z.ZodSchema<CompleteLike> = z.lazy(() =>
  likeSchema.extend({
    comment: relatedCommentSchema,
    user: relatedUserSchema,
  })
)
