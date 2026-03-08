'use client'

import { ScrollArea } from "@shadcn/components/ui/scroll-area"

import { TrackItem } from "./track-item"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export function TrackList() {
  return (
    <ScrollArea className="h-full w-full rounded-sm">
      <div className="pl-2">
        {tags.map((tag) => <TrackItem key={tag} />)}
      </div>
    </ScrollArea>
  )
}
