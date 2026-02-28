import type { LoginFormInput } from '@login/ui/client/form/form.types'

export type LoginBody = LoginFormInput

export interface LoginResponse {
  message: string
}
