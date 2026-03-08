'use client'

import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Progress } from '@shadcn/components/ui/progress'

import { metadataAtom, progressAtom } from '@atoms'
import { cn, msToTime } from '@lib/template'

export function ProgressBar() {
  const metadata = useAtomValue(metadataAtom)
  const progress = useAtomValue(progressAtom)
  const setProgress = useSetAtom(progressAtom)
  const duration = metadata?.duration ?? 0

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => ({ milliseconds: prev.milliseconds + 1000 }))
    }, 1000)

    if (progress.milliseconds > duration - 1000) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [setProgress, duration, progress.milliseconds])

  if (!metadata) return null

  const percentage = (progress.milliseconds / duration) * 100

  return (
    <div className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
      <span className="h-4 text-sm">
        {msToTime(progress.milliseconds)}
      </span>
        <Progress 
          value={progress.milliseconds} 
          id="progress-upload" 
          className={cn(
            'h-1.5 bg-neon transition-all', 
            percentage > 50 ? 'bg-neon-warm' : '', 
            percentage > 80 ? 'bg-neon-cool' : ''
          )} 
          style={{ width: `${percentage}%`, transition: "width 100ms linear" }}
        />
      <span className="h-4 text-sm">
        {msToTime(duration)}
      </span>
    </div>
  )
}
