import Link from 'next/link'

import { Logo } from '@lib/ui/server'

export function Header() {
  return (
    <header className="flex w-full h-14 items-center justify-between screen-padding border-b border-border sticky top-0 bg-card z-10">
      <Link href="/" aria-label="Go to home page">
        <Logo />
      </Link>
    </header>
  )
}
