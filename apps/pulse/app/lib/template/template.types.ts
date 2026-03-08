/* Next.js doesn't provide a built-in error type, so we need to create our own */
export interface PageErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}
