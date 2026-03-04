interface NowPlayingLayoutProps {
  ['song-info']?: React.ReactNode
  streaming?: React.ReactNode
  controller?: React.ReactNode
}

export default function NowPlayingLayout(props: NowPlayingLayoutProps) {
  const { ['song-info']: songInfo, streaming, controller } = props

  return (
    <div className="now-playing-layout">
      <div className="items-center">{songInfo}</div>
      <div className="flex-col items-center max-w-[500px] center-center">
        {streaming}
      </div>
      <div className="items-center justify-end">{controller}</div>
    </div>
  )
}
