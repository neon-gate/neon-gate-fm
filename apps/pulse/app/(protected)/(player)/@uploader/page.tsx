import { FileUpIcon } from "lucide-react";

export default function UploaderSlot() {
  return (
    <aside className="mobile-hidden overflow-y-auto mr-2 glassy-surface surface">
      <div className="flex flex-col cursor-pointer items-center justify-center gap-2 h-full outline-3 outline-dashed hover:outline-[var(--ps-neon-26)] outline-offset-2 transition-all duration-300">
        <FileUpIcon width={100} height={100} className="hover:text-[var(--ps-neon-26)]" />
        <span className="text-lg font-bold">Upload your music</span>
      </div>
    </aside>
  )
}
