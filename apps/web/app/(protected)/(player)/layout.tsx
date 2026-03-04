import { Header, Logo, Main } from '@lib/ui/server'
import { Suspense } from 'react'
import LibraryLoading from './@library/loading'

interface PlayerLayoutProps {
  children: React.ReactNode
  'user-menu'?: React.ReactNode
  'now-playing'?: React.ReactNode
  library?: React.ReactNode
  uploader?: React.ReactNode
}

export default function PlayerLayout(props: PlayerLayoutProps) {
  const { children, library, uploader } = props
  const nowPlaying = props['now-playing']
  const userMenu = props['user-menu']

  return (
    <div>
      <Header className="flex justify-between items-center mb-2">
        <Logo />
        {userMenu}
      </Header>
      <Main className="flex gap-2">
        <Suspense fallback={<LibraryLoading />}>{library}</Suspense>
        {children}
        {uploader}
      </Main>
      {nowPlaying}
    </div>
  )
}
