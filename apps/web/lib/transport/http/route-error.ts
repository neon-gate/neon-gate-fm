import { NextResponse } from 'next/server'

import { createHttpError } from './http-error.utils'
import { type HttpError, HttpErrorName } from './http-error.types'

function isHttpError(error: unknown): error is HttpError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    'status' in error &&
    'message' in error
  )
}

/**
 * Turns an unknown error into a NextResponse using the shared HTTP error types.
 * Used by BFF routes and handlers so all error responses come from one source of truth.
 */
export function normalizeRouteError(
  error: unknown,
  requestId: string
): NextResponse {
  if (isHttpError(error)) {
    return NextResponse.json(
      { error: error.name, message: error.message },
      { status: error.status, headers: { 'x-request-id': requestId } }
    )
  }
  const fallback = createHttpError(HttpErrorName.InternalServerError)
  return NextResponse.json(
    { error: fallback.name, message: fallback.message },
    { status: fallback.status, headers: { 'x-request-id': requestId } }
  )
}
