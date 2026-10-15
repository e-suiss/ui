import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  PreviewMenu,
  PreviewMenuContent,
  PreviewMenuItem,
  PreviewMenuSeparator,
  PreviewMenuTrigger,
} from "@/components/interactions/preview-menu"
import { cn } from "@/lib/utils"

const photos = [
  "from-blue-500 to-purple-500",
  "from-orange-500 to-pink-500",
  "from-green-500 to-teal-500",
  "from-indigo-500 to-blue-500",
  "from-yellow-500 to-orange-500",
  "from-pink-500 to-red-500",
  "from-teal-500 to-cyan-500",
  "from-purple-500 to-indigo-500",
  "from-teal-400 to-green-500",
]

function Photo({ tone, label }: { tone: string; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("aspect-square size-full bg-linear-to-br", tone)}
    />
  )
}

function PhotoGrid({ withDisabled = false }: { withDisabled?: boolean }) {
  const [log, setLog] = React.useState(
    "Touch and hold a photo, or right-click it."
  )

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {photos.map((tone, index) => {
          const label = `Photo ${index + 1}`
          return (
            <PreviewMenu key={tone}>
              <PreviewMenuTrigger className="aspect-square overflow-hidden rounded-2xl">
                <Photo tone={tone} label={label} />
              </PreviewMenuTrigger>
              <PreviewMenuContent>
                <PreviewMenuItem onClick={() => setLog(`Copied ${label}`)}>
                  Copy
                  <IconPlaceholder
                    lucide="CopyIcon"
                    tabler="IconCopy"
                    hugeicons="Copy01Icon"
                    phosphor="CopyIcon"
                    remixicon="RiFileCopyLine"
                  />
                </PreviewMenuItem>
                <PreviewMenuItem onClick={() => setLog(`Shared ${label}`)}>
                  Share
                  <IconPlaceholder
                    lucide="Share2Icon"
                    tabler="IconShare"
                    hugeicons="Share08Icon"
                    phosphor="ShareNetworkIcon"
                    remixicon="RiShareLine"
                  />
                </PreviewMenuItem>
                <PreviewMenuItem
                  disabled={withDisabled}
                  onClick={() => setLog(`Favorited ${label}`)}
                >
                  Favorite
                  <IconPlaceholder
                    lucide="HeartIcon"
                    tabler="IconHeart"
                    hugeicons="FavouriteIcon"
                    phosphor="HeartIcon"
                    remixicon="RiHeartLine"
                  />
                </PreviewMenuItem>
                <PreviewMenuSeparator />
                <PreviewMenuItem
                  variant="destructive"
                  onClick={() => setLog(`Deleted ${label}`)}
                >
                  Delete
                  <IconPlaceholder
                    lucide="TrashIcon"
                    tabler="IconTrash"
                    hugeicons="Delete02Icon"
                    phosphor="TrashIcon"
                    remixicon="RiDeleteBinLine"
                  />
                </PreviewMenuItem>
              </PreviewMenuContent>
            </PreviewMenu>
          )
        })}
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {log}
      </p>
    </div>
  )
}

export default function PreviewMenuDisabledItem() {
  return <PhotoGrid withDisabled />
}
