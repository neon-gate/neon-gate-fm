import axios from 'axios'

import {
  loginErrorResponseInterceptor,
  loginRequestInterceptor
} from './interceptors'

export const client = axios.create({
  baseURL: process.env.BFF_BASE_URL,
  timeout: Number(process.env.BFF_API_TIMEOUT_MS)
})

client.interceptors.response.use(
  (response) => response,
  loginErrorResponseInterceptor
)

client.interceptors.request.use(loginRequestInterceptor)
