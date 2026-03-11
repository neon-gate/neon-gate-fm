import { z } from 'zod'

import type { StartRequest } from '../start.types'

const startSchema = z
  .object({
    trackId: z.string().uuid().optional()
  })
  .strict()

export function isStartBodyValid(body: unknown): StartRequest {
  return startSchema.parse(body)
}
