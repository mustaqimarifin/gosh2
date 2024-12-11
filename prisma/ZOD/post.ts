import { CompleteComment, relatedCommentSchema } from './index'
import * as z from 'zod'

export const postSchema = z.object({
  slug: z.string(),
  count: z.bigint().nullish(),
})

export interface CompletePost extends z.infer<typeof postSchema> {
  comments: CompleteComment[]
}

/**
 * relatedPostSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedPostSchema: z.ZodSchema<CompletePost> = z.lazy(() =>
  postSchema.extend({
    comments: relatedCommentSchema.array(),
  })
)
