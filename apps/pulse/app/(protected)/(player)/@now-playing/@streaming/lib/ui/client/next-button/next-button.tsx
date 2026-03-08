'use client'

import { SkipForwardIcon } from 'lucide-react'

export function NextButton() {
  return (
    <button
      aria-label="Next track"
      className="rounded-md p-1 outline-none ring-ring/50 focus-visible:ring-2 cursor-pointer"
      type="button"
    >
      <SkipForwardIcon height={20} width={20} />
    </button>
  )
}
