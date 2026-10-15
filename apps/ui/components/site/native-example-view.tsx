"use client"

import { cn } from "cn"
import Image from "next/image"
import * as React from "react"

import { useActivePlatform } from "@/components/site/platform"
import { SourceCode } from "@/components/site/source-code"
import { useTheme } from "@/components/ui/theme"
import type { Platform } from "@/lib/platform"

function previewAlt(id: string, scheme: string) {
  const [component = "", story = ""] = id.split("--")
  const words = (value: string) => value.split("-").filter(Boolean)
  const name = words(component)
    .slice(1)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
  const variant = words(story).join(" ")
  return `${name}${variant && variant !== "default" ? ` (${variant})` : ""} on iOS in ${scheme} mode`
}

function LiveFrame({
  live,
  id,
  width,
  height,
}: {
  live: string
  id: string
  width?: number
  height?: number
}) {
  const { resolvedTheme } = useTheme()
  const ref = React.useRef<HTMLIFrameElement>(null)
  const [file = "", story = "Default"] = live.split("/")
  const [initial, setInitial] = React.useState<string>()
  React.useEffect(() => {
    if (!initial && resolvedTheme) setInitial(resolvedTheme)
  }, [initial, resolvedTheme])
  React.useEffect(() => {
    ref.current?.contentWindow?.postMessage(
      { theme: resolvedTheme },
      window.location.origin
    )
  }, [resolvedTheme])
  if (!initial)
    return (
      <div
        style={{
          aspectRatio: width && height ? `${width} / ${height}` : undefined,
        }}
      />
    )
  return (
    <iframe
      ref={ref}
      src={`/live/index.html?file=${file}&story=${story}&theme=${initial}`}
      title={previewAlt(id, initial)}
      loading="lazy"
      onLoad={() =>
        ref.current?.contentWindow?.postMessage(
          { theme: resolvedTheme },
          window.location.origin
        )
      }
      className="block w-full bg-background"
      style={{
        aspectRatio:
          width && height
            ? `${width} / ${Math.max(height, width * 1.1)}`
            : "9 / 16",
      }}
    />
  )
}

const CODE_PLATFORMS: Record<string, Platform> = {
  "React Native": "rn",
  SwiftUI: "swift",
  Compose: "kotlin",
}

export function NativeExampleView({
  id,
  width,
  height,
  platforms = [],
  video,
  live,
  children,
}: {
  id?: string
  width?: number
  height?: number
  platforms?: string[]
  video?: boolean
  live?: string
  children: React.ReactNode
}) {
  const [tab, setTab] = React.useState<"preview" | "code">(
    id ? "preview" : "code"
  )
  const panels = React.Children.toArray(children).filter(React.isValidElement)
  const labels = platforms.length === panels.length ? platforms : []
  const codePlatforms = labels.map((label) => CODE_PLATFORMS[label] ?? "rn")
  const selected = useActivePlatform(
    codePlatforms.length ? codePlatforms : ["rn"]
  )
  const active = Math.max(0, codePlatforms.indexOf(selected))
  const mobilePlatform = useActivePlatform(["rn", "swift", "kotlin"])
  const showLive = Boolean(live) && mobilePlatform === "rn"

  return (
    <div data-not-prose className="mt-[1.2em]">
      <div
        role="tablist"
        className="flex gap-4 border-b sm:gap-5 border-foreground/12"
      >
        {(id ? (["preview", "code"] as const) : (["code"] as const)).map(
          (item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              className={cn(
                "relative h-9 cursor-pointer text-sm font-medium capitalize tracking-[-0.01em] outline-none transition-colors focus-visible:focus-ring",
                tab === item
                  ? "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-[1.5px] after:rounded-full after:bg-foreground"
                  : "text-foreground/45 hover:text-foreground"
              )}
            >
              {item}
            </button>
          )
        )}
        {id && (
          <span className="ms-auto self-center font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase">
            {showLive ? "Web" : "iOS"}
          </span>
        )}
      </div>
      {id && (
        <div hidden={tab !== "preview"}>
          <div
            data-slot="preview"
            className="mt-[1.2em] flex flex-col items-center gap-4 overflow-hidden rounded-[24px] bg-muted px-6 py-10 ring-1 ring-foreground/10 md:py-14"
          >
            <div className="w-full max-w-[360px] overflow-hidden rounded-[28px] shadow-[0_24px_60px_-28px_rgb(0_0_0/0.35)] ring-1 ring-foreground/10">
              {showLive && live ? (
                <LiveFrame live={live} id={id} width={width} height={height} />
              ) : (
                (["light", "dark"] as const).map((scheme) =>
                  video ? (
                    <video
                      key={scheme}
                      src={`/previews/${id}.${scheme}.mp4`}
                      poster={`/previews/${id}.${scheme}.webp`}
                      width={width}
                      height={height}
                      aria-label={previewAlt(id, scheme)}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className={cn(
                        "block h-auto w-full",
                        scheme === "light" ? "dark:hidden" : "hidden dark:block"
                      )}
                    />
                  ) : (
                    <Image
                      key={scheme}
                      unoptimized
                      src={`/previews/${id}.${scheme}.webp`}
                      width={width}
                      height={height}
                      alt={previewAlt(id, scheme)}
                      loading="lazy"
                      decoding="async"
                      className={cn(
                        "block h-auto w-full",
                        scheme === "light" ? "dark:hidden" : "hidden dark:block"
                      )}
                    />
                  )
                )
              )}
            </div>
            {showLive && (
              <p className="font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase">
                Web preview
              </p>
            )}
          </div>
        </div>
      )}
      <div hidden={tab !== "code"}>
        {labels.length > 1 ? (
          panels.map((panel, index) => (
            <div key={labels[index]} hidden={index !== active}>
              <SourceCode>{panel}</SourceCode>
            </div>
          ))
        ) : (
          <SourceCode>{children}</SourceCode>
        )}
      </div>
    </div>
  )
}
