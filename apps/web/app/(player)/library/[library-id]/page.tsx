interface LibraryProps {
  libraryId: string
}

export default async function Library(props: LibraryProps) {
  const { libraryId } = props

  return <div id="library">{libraryId}</div>
}
