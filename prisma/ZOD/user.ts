import {
  CompleteAccount,
  relatedAccountSchema,
  CompleteComment,
  relatedCommentSchema,
  CompleteCommentReaction,
  relatedCommentReactionSchema,
  CompleteHotline,
  relatedHotlineSchema,
  CompleteLike,
  relatedLikeSchema,
  CompleteSession,
  relatedSessionSchema,
} from './index'
import { Level } from '@prisma/client'
import * as z from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
  level: z.nativeEnum(Level).nullish(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  accounts: CompleteAccount[]
  comments: CompleteComment[]
  reactions: CompleteCommentReaction[]
  hotlines: CompleteHotline[]
  likes: CompleteLike[]
  sessions: CompleteSession[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() =>
  userSchema.extend({
    accounts: relatedAccountSchema.array(),
    comments: relatedCommentSchema.array(),
    reactions: relatedCommentReactionSchema.array(),
    hotlines: relatedHotlineSchema.array(),
    likes: relatedLikeSchema.array(),
    sessions: relatedSessionSchema.array(),
  })
)
