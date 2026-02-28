import { normalizeRouteError } from '@lib/transport/http'
import { NextResponse } from 'next/server'

import { login } from './service'
import type { LoginBody } from './types'

export async function handle(
  body: LoginBody,
  requestId: string
): Promise<NextResponse> {
  try {
    const data = await login(body, requestId)
    return NextResponse.json(data, {
      headers: { 'x-request-id': requestId }
    })
  } catch (error) {
    return normalizeRouteError(error, requestId)
  }
}
