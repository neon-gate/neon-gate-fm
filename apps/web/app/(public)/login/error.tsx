'use client'

import { Button } from '@base-ui/react/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function LoginError(props: ErrorProps) {
  const { reset } = props

  function handleReset() {
    reset()
  }

  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button type="button" onClick={handleReset}>
        Try again
      </Button>
    </div>
  )
}
