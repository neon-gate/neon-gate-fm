'use client'

import type { NextPageErrorProps } from '@lib/ui/client'

export default function SongInfoError(props: NextPageErrorProps) {
  const { error, reset } = props

  function handleReset() {
    reset()
  }

  return (
    <div>
      <h2>Now playing song metadata failed to load.</h2>
      <p>{error.message}</p>
      <button
        className="mt-2 rounded-md border border-border px-3 py-1 text-sm font-medium"
        type="button"
        onClick={handleReset}
      >
        Try again
      </button>
    </div>
  )
}
