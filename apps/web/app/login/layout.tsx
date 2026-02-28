interface LoginLayoutProps {
  children: React.ReactNode
}

export default function LoginLayout(props: LoginLayoutProps) {
  const { children } = props

  return <div className="min-h-screen flex flex-col">{children}</div>
}
