import {
  NextButton,
  PlayPauseButton,
  PreviousButton,
  ProgressBar
} from './lib/ui'

export default function PlaybackSlot() {
  return (
    <div>
      <div className="flex items-center justify-center gap-4">
        <PreviousButton />
        <PlayPauseButton />
        <NextButton />
      </div>
      <ProgressBar />
    </div>
  )
}
