interface NowPlayingProps {
  songId: string
}

export default async function NowPlaying(props: NowPlayingProps) {
  const { songId } = props

  return <div id="now-playing">{songId}</div>
}
