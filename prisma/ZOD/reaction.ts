import { CompleteCommentReaction, relatedCommentReactionSchema } from './index'
import * as z from 'zod'

// Helper schema for JSON fields
type Literal = boolean | number | string | null
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
)

export const reactionSchema = z.object({
  type: z.string(),
  createdAt: z.date(),
  label: z.string(),
  url: z.string(),
  metadata: jsonSchema,
})

export interface CompleteReaction extends z.infer<typeof reactionSchema> {
  reactions: CompleteCommentReaction[]
}

/**
 * relatedReactionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedReactionSchema: z.ZodSchema<CompleteReaction> = z.lazy(() =>
  reactionSchema.extend({
    reactions: relatedCommentReactionSchema.array(),
  })
)
