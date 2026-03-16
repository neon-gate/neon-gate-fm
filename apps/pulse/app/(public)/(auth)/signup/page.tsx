import { Metadata } from 'next'
import Link from 'next/link'

import { description, robots } from '@state'
import { Logo } from '@lib/ui'
import { SignupForm } from '@signup/ui'

export const metadata: Metadata = {
  title: 'Pulse - Signup',
  description,
  robots
}

export default function SignupPage() {
  return (
    <main className="flex items-center justify-center h-full">
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <Logo width="60" height="60" />
          </Link>
          <SignupForm />
        </div>
      </div>
    </main>
  )
}
