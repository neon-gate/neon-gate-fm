import { Header, Logo } from '@lib/ui/server'
import { LoginForm } from '@login/ui/client/form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neon Gate FM - Login',
  description: 'The app that hates your > 2000s songs. 😤',
  robots: {
    index: false,
    follow: false
  }
}

export default function Page() {
  return (
    <div id="login-page" className="flex flex-col screen-side-padding">
      <Header>
        <Logo />
      </Header>
      <main className="flex items-center justify-center">
        <LoginForm />
      </main>
    </div>
  )
}
