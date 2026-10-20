import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  PreviewMenu,
  PreviewMenuContent,
  PreviewMenuItem,
  PreviewMenuSeparator,
  PreviewMenuTrigger,
} from "@/components/interactions/preview-menu"

const photos = [
  { from: "var(--color-blue-500)", to: "var(--color-purple-500)" },
  { from: "var(--color-orange-500)", to: "var(--color-pink-500)" },
  { from: "var(--color-green-500)", to: "var(--color-teal-500)" },
  { from: "var(--color-indigo-500)", to: "var(--color-blue-500)" },
  { from: "var(--color-yellow-500)", to: "var(--color-orange-500)" },
  { from: "var(--color-pink-500)", to: "var(--color-red-500)" },
  { from: "var(--color-teal-500)", to: "var(--color-cyan-500)" },
  { from: "var(--color-purple-500)", to: "var(--color-indigo-500)" },
  { from: "var(--color-teal-400)", to: "var(--color-green-500)" },
]

export default function PreviewMenuDisabledItem() {
  const [log, setLog] = React.useState(
    "Touch and hold a photo, or right-click it."
  )

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => {
          const label = `Photo ${index + 1}`
          return (
            <PreviewMenu key={label}>
              <PreviewMenuTrigger className="aspect-square overflow-hidden rounded-2xl">
                <div
                  role="img"
                  aria-label={label}
                  style={
                    {
                      "--from": photo.from,
                      "--to": photo.to,
                    } as React.CSSProperties
                  }
                  className="aspect-square size-full bg-linear-to-br from-(--from) to-(--to)"
                />
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
                  isDisabled
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
