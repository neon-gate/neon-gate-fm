import { normalizeRouteError } from '@lib/transport/http'
import { NextResponse } from 'next/server'

import { handle } from './handler'
import type { LoginBody } from './types'

function getRequestId(request: Request): string {
  return request.headers.get('x-request-id') ?? crypto.randomUUID()
}

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = getRequestId(request)

  try {
    const body = (await request.json()) as LoginBody
    return await handle(body, requestId)
  } catch (error) {
    return normalizeRouteError(error, requestId)
  }
}
