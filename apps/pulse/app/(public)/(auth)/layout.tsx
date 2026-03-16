interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout(props: AuthLayoutProps) {
  const { children } = props

  return (
    <div className="flex flex-col bg-neon-cool min-h-svh text-foreground">
      {children}
    </div>
  )
}
