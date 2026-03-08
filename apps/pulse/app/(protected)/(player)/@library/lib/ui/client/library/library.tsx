'use client'

import { AudioLinesIcon } from "lucide-react";
import { Card } from "@shadcn/components/ui/card";

import { TrackList } from "@library/ui";

export function Library() {
  return (
    <Card className="sm:col-span-1 col-span-3 surface glassy-surface ml-2">
      <div className="flex items-center justify-center gap-2">
        <AudioLinesIcon />
        <span className="text-lg font-bold">Library</span>
      </div>
      <TrackList />
    </Card>
  )
}
