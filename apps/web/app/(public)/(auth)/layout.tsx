import { Logo } from '@lib/ui/client'
import { Header } from '@lib/ui/server'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout(props: AuthLayoutProps) {
  const { children } = props

  return (
    <div className="flex flex-col">
      <Header>
        <Logo />
      </Header>
      {children}
    </div>
  )
}
