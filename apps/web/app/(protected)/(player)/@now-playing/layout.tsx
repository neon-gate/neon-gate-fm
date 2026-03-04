interface NowPlayingLayoutProps {
  ['song-info']?: React.ReactNode
  streaming?: React.ReactNode
  controller?: React.ReactNode
}

export default function NowPlayingLayout(props: NowPlayingLayoutProps) {
  const { ['song-info']: songInfo, streaming, controller } = props

  return (
    <div>
      <div>{songInfo}</div>
      <div>{streaming}</div>
      <div>{controller}</div>
    </div>
  )
}
