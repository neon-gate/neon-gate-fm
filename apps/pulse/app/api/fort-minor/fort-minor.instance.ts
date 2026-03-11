import axios from 'axios'

export const fortMinorInstance = axios.create({
  baseURL: process.env.FORT_MINOR_BASE_URL ?? process.env.BFF_BASE_URL,
  timeout: Number(process.env.BFF_API_TIMEOUT_MS)
})

fortMinorInstance.interceptors.response.use((response) => response)
