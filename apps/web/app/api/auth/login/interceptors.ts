import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

import {
  createHttpError,
  createHttpErrorFromStatus,
  HttpErrorName
} from '@lib/transport/http'
import { loginSchema } from '@login/ui/client/form'

export function loginRequestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  const parsed = loginSchema.safeParse(config.data)
  if (!parsed.success) {
    throw createHttpError(HttpErrorName.ValidationError)
  }
  return config
}

export function loginErrorResponseInterceptor(error: AxiosError) {
  if (axios.isAxiosError(error)) {
    // Server responded with a status code
    if (error.response) {
      const httpError = createHttpErrorFromStatus(error.response.status)
      const withData = {
        ...httpError,
        responseData: error.response.data
      }
      return Promise.reject(withData)
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(createHttpError(HttpErrorName.RequestTimeout))
    }

    // Network failure
    return Promise.reject(createHttpError(HttpErrorName.ServiceUnavailable))
  }

  // Unknown unexpected error
  return Promise.reject(createHttpError(HttpErrorName.InternalServerError))
}
