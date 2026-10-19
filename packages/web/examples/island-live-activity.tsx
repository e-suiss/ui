import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Island,
  IslandCompact,
  IslandExpanded,
  IslandProvider,
  IslandRing,
  useIsland,
} from "@/components/interactions/island"
import { Button } from "@/components/ui/button"

const SIZE = 120

function DownloadsExample() {
  const [progress, setProgress] = React.useState<number | null>(null)
  const { notify } = useIsland()
  const percent = Math.round((progress ?? 0) * 100)

  React.useEffect(() => {
    if (progress === null || progress >= 1) return
    const timer = window.setTimeout(
      () => setProgress((value) => Math.min((value ?? 0) + 0.01, 1)),
      150
    )
    return () => window.clearTimeout(timer)
  }, [progress])

  React.useEffect(() => {
    if (progress !== 1) return
    const timer = window.setTimeout(() => {
      setProgress(null)
      notify({
        icon: (
          <IconPlaceholder
            lucide="CircleCheckIcon"
            tabler="IconCircleCheck"
            hugeicons="CheckmarkCircle02Icon"
            phosphor="CheckCircleIcon"
            remixicon="RiCheckboxCircleLine"
            className="fill-green-500 text-white"
          />
        ),
        title: "Download complete",
        description: "Design-Kit.zip",
      })
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [progress, notify])

  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
      <Island>
        {progress !== null && (
          <>
            <IslandCompact
              aria-label={`Downloading Design-Kit.zip, ${percent}%`}
            >
              <IconPlaceholder
                lucide="DownloadIcon"
                tabler="IconDownload"
                hugeicons="Download01Icon"
                phosphor="DownloadSimpleIcon"
                remixicon="RiDownloadLine"
                className="text-primary"
              />
              {progress >= 1 ? (
                <IconPlaceholder
                  lucide="CircleCheckIcon"
                  tabler="IconCircleCheck"
                  hugeicons="CheckmarkCircle02Icon"
                  phosphor="CheckCircleIcon"
                  remixicon="RiCheckboxCircleLine"
                  className="fill-green-500 text-white"
                />
              ) : (
                <IslandRing value={progress} data-visual-mask />
              )}
            </IslandCompact>
            <IslandExpanded aria-label="Download">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background/15 dark:bg-foreground/15">
                  <IconPlaceholder
                    lucide="FileArchiveIcon"
                    tabler="IconFileZip"
                    hugeicons="FileZipIcon"
                    phosphor="FileZipIcon"
                    remixicon="RiFileZipLine"
                    className="size-6 text-primary"
                  />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold">
                    Design-Kit.zip
                  </span>
                  <span className="text-sm text-background/70 tabular-nums dark:text-muted-foreground">
                    {progress >= 1
                      ? "Downloaded"
                      : `${Math.round(progress * SIZE)} MB of ${SIZE} MB`}
                  </span>
                </span>
                <span className="text-2xl font-semibold tabular-nums">
                  {percent}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Download progress"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-1.5 overflow-hidden rounded-full bg-background/20 dark:bg-foreground/20"
              >
                <div
                  className="h-full origin-left rounded-full bg-primary transition-[scale] duration-300 rtl:origin-right"
                  style={{ scale: `${progress} 1` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setProgress(null)}
                disabled={progress >= 1}
                className="h-11 rounded-full bg-background/15 text-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-foreground/15"
              >
                Cancel download
              </button>
            </IslandExpanded>
          </>
        )}
      </Island>
      <p className="max-w-xs text-sm text-muted-foreground">
        Start a download, then tap the pill at the top to see the details.
      </p>
      <Button onClick={() => setProgress(0)} disabled={progress !== null}>
        {progress === null ? "Download Design-Kit.zip" : "Downloading…"}
      </Button>
    </div>
  )
}

export default function IslandLiveActivity() {
  return (
    <IslandProvider>
      <DownloadsExample />
    </IslandProvider>
  )
}
