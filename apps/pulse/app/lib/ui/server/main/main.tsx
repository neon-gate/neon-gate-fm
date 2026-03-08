interface MainProps {
  children: React.ReactNode
  className?: string
}

export function Main(props: MainProps) {
  return <main {...props} />
}
