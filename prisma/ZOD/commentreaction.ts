import {
  CompleteComment,
  relatedCommentSchema,
  CompleteReaction,
  relatedReactionSchema,
  CompleteUser,
  relatedUserSchema,
} from './index'
import * as z from 'zod'

export const commentReactionSchema = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  commentId: z.number().int().nullish(),
  userId: z.string().nullish(),
  reactionType: z.string(),
})

export interface CompleteCommentReaction
  extends z.infer<typeof commentReactionSchema> {
  comment?: CompleteComment | null
  reaction: CompleteReaction
  user?: CompleteUser | null
}

/**
 * relatedCommentReactionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCommentReactionSchema: z.ZodSchema<CompleteCommentReaction> =
  z.lazy(() =>
    commentReactionSchema.extend({
      comment: relatedCommentSchema.nullish(),
      reaction: relatedReactionSchema,
      user: relatedUserSchema.nullish(),
    })
  )
