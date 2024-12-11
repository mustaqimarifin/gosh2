import { CompleteUser, relatedUserSchema } from './index'
import * as z from 'zod'

export const hotlineSchema = z.object({
  id: z.number().int(),
  text: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  userId: z.string().nullish(),
})

export interface CompleteHotline extends z.infer<typeof hotlineSchema> {
  user?: CompleteUser | null
}

/**
 * relatedHotlineSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedHotlineSchema: z.ZodSchema<CompleteHotline> = z.lazy(() =>
  hotlineSchema.extend({
    user: relatedUserSchema.nullish(),
  })
)
