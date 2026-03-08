import { AudioLinesIcon } from "lucide-react";
import { Card } from "@shadcn/components/ui/card";

import { TrackList } from "@library/ui";

export default function LibrarySlot() {
  return (
    <Card className="sm:col-span-1 col-span-3 surface glassy-surface mx-2">
      <div className="flex items-center justify-center gap-2">
        <AudioLinesIcon />
        <span className="text-lg font-bold">Library</span>
      </div>
      <TrackList />
    </Card>
  )
}
