import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const clientSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string(),
  segment: z.string(),
})

export type Client = z.infer<typeof clientSchema>