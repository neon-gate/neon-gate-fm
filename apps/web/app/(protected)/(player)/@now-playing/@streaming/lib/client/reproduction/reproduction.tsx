'use client'

import {
  PlayIcon,
  TrackNextIcon,
  TrackPreviousIcon
} from '@radix-ui/react-icons'
import * as Progress from '@radix-ui/react-progress'

export function Reproduction() {
  const currentSeconds = 92
  const totalSeconds = 220
  const progressValue = (currentSeconds / totalSeconds) * 100

  return (
    <div>
      <div className="flex items-center justify-center gap-6 text-foreground">
        <button
          aria-label="Previous track"
          className="rounded-md p-1 outline-none ring-ring/50 focus-visible:ring-2"
          type="button"
        >
          <TrackPreviousIcon height={20} width={20} />
        </button>
        <button
          aria-label="Play"
          className="rounded-full p-1 outline-none ring-ring/50 focus-visible:ring-2"
          type="button"
        >
          <PlayIcon height={24} width={24} />
        </button>
        <button
          aria-label="Next track"
          className="rounded-md p-1 outline-none ring-ring/50 focus-visible:ring-2"
          type="button"
        >
          <TrackNextIcon height={20} width={20} />
        </button>
      </div>

      <div className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
        <span className="h-4 text-right text-xs leading-4 text-foreground-muted">
          1:32
        </span>
        <Progress.Root
          aria-label="Playback progress"
          className="h-1 w- overflow-hidden rounded-full"
          max={100}
          value={progressValue}
        >
          <Progress.Indicator
            className="h-full bg-foreground transition-transform"
            style={{ transform: `translateX(-${100 - progressValue}%)` }}
          />
        </Progress.Root>
        <span className="h-4 text-xs leading-4 text-foreground-muted">
          3:40
        </span>
      </div>
    </div>
  )
}
