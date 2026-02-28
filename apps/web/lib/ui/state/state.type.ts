import type { HttpError } from '@lib/transport/http'
import type { FieldErrors, ZodObjectSchema } from '@lib/ui/validation'

export interface State<Schema extends ZodObjectSchema> {
  apiError: HttpError | null
  fieldErrors: FieldErrors<Schema>
  isPending: boolean
}
