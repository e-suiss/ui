import {
  CopyIcon,
  HeartIcon,
  ShareNetworkIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"
import {
  PreviewMenu,
  PreviewMenuContent,
  PreviewMenuItem,
  PreviewMenuSeparator,
  PreviewMenuTrigger,
} from "@/components/interactions/preview-menu"

const photos = [
  "from-blue to-purple",
  "from-orange to-pink",
  "from-green to-teal",
  "from-indigo to-blue",
  "from-yellow to-orange",
  "from-pink to-red",
  "from-teal to-cyan",
  "from-purple to-indigo",
  "from-mint to-green",
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
                  <CopyIcon />
                </PreviewMenuItem>
                <PreviewMenuItem onClick={() => setLog(`Shared ${label}`)}>
                  Share
                  <ShareNetworkIcon />
                </PreviewMenuItem>
                <PreviewMenuItem
                  disabled={withDisabled}
                  onClick={() => setLog(`Favorited ${label}`)}
                >
                  Favorite
                  <HeartIcon />
                </PreviewMenuItem>
                <PreviewMenuSeparator />
                <PreviewMenuItem
                  variant="destructive"
                  onClick={() => setLog(`Deleted ${label}`)}
                >
                  Delete
                  <TrashIcon />
                </PreviewMenuItem>
              </PreviewMenuContent>
            </PreviewMenu>
          )
        })}
      </div>
      <p role="status" className="text-sm text-label-secondary">
        {log}
      </p>
    </div>
  )
}

export default function PreviewMenuDemo() {
  return <PhotoGrid />
}
