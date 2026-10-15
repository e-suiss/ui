import { ShareNetworkIcon, TrashIcon } from "@phosphor-icons/react"
import {
  PreviewMenu,
  PreviewMenuContent,
  PreviewMenuItem,
  PreviewMenuTrigger,
} from "@/components/interactions/preview-menu"

export default function PreviewMenuCustomPreview() {
  return (
    <div className="mx-auto w-full max-w-md">
      <PreviewMenu aspectRatio={4 / 3}>
        <PreviewMenuTrigger className="flex items-center gap-3 rounded-xl bg-surface-secondary p-3">
          <div className="size-12 shrink-0 rounded-lg bg-linear-to-br from-blue to-purple" />
          <div className="flex flex-col">
            <span className="font-semibold">Trip to the coast</span>
            <span className="text-sm text-label-secondary">48 photos</span>
          </div>
        </PreviewMenuTrigger>
        <PreviewMenuContent
          preview={
            <div className="flex flex-col justify-end bg-linear-to-br from-blue to-purple p-4 text-on-accent">
              <span className="text-lg font-semibold">Trip to the coast</span>
              <span className="text-sm">48 photos · Updated today</span>
            </div>
          }
        >
          <PreviewMenuItem>
            Share album
            <ShareNetworkIcon />
          </PreviewMenuItem>
          <PreviewMenuItem variant="destructive">
            Delete album
            <TrashIcon />
          </PreviewMenuItem>
        </PreviewMenuContent>
      </PreviewMenu>
    </div>
  )
}
