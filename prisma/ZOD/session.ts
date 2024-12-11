import { CompleteUser, relatedUserSchema } from './index'
import * as z from 'zod'

export const sessionSchema = z.object({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.date(),
})

export interface CompleteSession extends z.infer<typeof sessionSchema> {
  user: CompleteUser
}

/**
 * relatedSessionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSessionSchema: z.ZodSchema<CompleteSession> = z.lazy(() =>
  sessionSchema.extend({
    user: relatedUserSchema,
  })
)
