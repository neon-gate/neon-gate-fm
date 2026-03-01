interface LoginLayoutProps {
  children: React.ReactNode
}

export default function LoginLayout(props: LoginLayoutProps) {
  const { children } = props

  return <div>{children}</div>
}
