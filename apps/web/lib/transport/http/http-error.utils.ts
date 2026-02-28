import { HttpError, HttpErrorName } from './http-error.types'
import { HTTP_ERROR_MAP } from './http-error.mapper'

export function createHttpError(name: HttpErrorName): HttpError {
  const meta = HTTP_ERROR_MAP[name]

  return {
    name,
    status: meta.status,
    message: meta.message,
    retryable: meta.retryable
  }
}

export function createHttpErrorFromStatus(status: number): HttpError {
  const entry = Object.entries(HTTP_ERROR_MAP).find(
    ([, meta]) => meta.status === status
  )

  if (!entry) {
    return createHttpError(HttpErrorName.InternalServerError)
  }

  const [name, meta] = entry

  return {
    name: name as HttpErrorName,
    status: meta.status,
    message: meta.message,
    retryable: meta.retryable
  }
}
