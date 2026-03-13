import { FolderUpIcon } from 'lucide-react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia
} from '@shadcn/components/ui/empty'
import { cn } from '@lib/template'

export function Uploader() {
  return (
    <Empty className={cn('border-dashed border-4 border-slate-400 h-full')}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderUpIcon className="size-11 text-(--ps-neon-10)" />
        </EmptyMedia>
        <EmptyDescription className="text-2xl font-extrabold text-neon">
          Upload your music.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
