'use client'

import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@shadcn/components/ui/item"
import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"

export function TrackItem() {
  return (
    <Item variant="outline" className="mb-2 h-14">
      <ItemMedia>
        <BadgeCheckIcon className="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Your profile has been verified.</ItemTitle>
      </ItemContent>
      <ItemActions>
        <ChevronRightIcon className="size-4" />
      </ItemActions>
    </Item>
  )
}
