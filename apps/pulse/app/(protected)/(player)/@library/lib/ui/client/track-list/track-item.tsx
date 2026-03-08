'use client'

import Image from "next/image"
import { useAtomValue } from "jotai"
import { PlayCircleIcon } from "lucide-react"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@shadcn/components/ui/item"

import { metadataAtom } from "@lib/state/atoms"
import { msToTime } from "@lib/template"

export function TrackItem() {
  const track = useAtomValue(metadataAtom)

  if (!track) return null

  return (
    <Item variant="outline" className="mb-2 h-16 hover:bg-[var(--ps-neon-25)]">
      <ItemMedia>
        <Image
          className="rounded-sm mr-2"
          src={track.album.cover}
          alt={`${track.album.name} by ${track.artist}`}
          loading="eager"  
          width={38}
          height={38}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-lg/tight leading-tight font-bold">{track.title}</ItemTitle>
        <ItemDescription className="flex items-center justify-between text-sm/tight font-semibold">
          {`${track.album.name} by ${track.artist} - ${msToTime(track.duration)}`}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <PlayCircleIcon className="size-6 text-[var(--ps-neon-08)]" />
      </ItemActions>
    </Item>
  )
}
