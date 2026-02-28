import { createHttpError, HttpErrorName } from '@lib/transport/http'

import { client } from './client'
import type { LoginBody, LoginResponse } from './types'

/**
 * Calls the auth API (same origin as BFF via BFF_BASE_URL).
 * Uses shared HTTP error types so BFF and frontend stay in sync.
 */
export async function login(
  body: LoginBody,
  requestId: string
): Promise<LoginResponse> {
  if (!process.env.BFF_BASE_URL) {
    throw createHttpError(HttpErrorName.ServiceUnavailable)
  }

  const { data } = await client.post<LoginResponse>('/login', body, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-request-id': requestId
    }
  })

  return data
}
