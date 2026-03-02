import { Header, Logo } from '@lib/ui/server'
import { UserDropdown } from '@player/ui/client'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'NeonGate AI FM',
  description: 'The app that hates your > 2000s songs. 😤',
  robots: {
    index: false,
    follow: false
  }
}

interface PlayerProps {
  children: React.ReactNode
}

export default async function Player(props: PlayerProps) {
  const { children } = props

  const isAuthenticated = true // TODO: replace with actual authentication check

  if (!isAuthenticated) {
    redirect('/login')
  }

  // TODO: create container tailwind utility duplicated
  return (
    <div id="player" className="flex flex-col screen-side-padding">
      <Header className="flex flex-row justify-between items-center">
        <Logo />
        <UserDropdown />
      </Header>
      <main>{children}</main>
    </div>
  )
}
