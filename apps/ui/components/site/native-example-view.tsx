"use client"

import Image from "next/image"
import * as React from "react"
import { ExamplePreview } from "@/components/site/example-preview"
import { CodeVisible } from "@/components/site/lazy-source"
import { useActivePlatform } from "@/components/site/platform"
import {
  ResponsivePreview,
  useResponsivePreview,
} from "@/components/site/responsive-preview"
import { SourceCode } from "@/components/site/source-code"
import { basePath, withBase } from "@/lib/base-path"
import { PLATFORM_LABELS, type Platform } from "@/lib/platform"
import type { Preview } from "@/lib/previews"
import { strings } from "@/lib/strings"
import { cn } from "@/lib/utils"

function previewAlt(id: string, scheme: string) {
  const [component = "", story = ""] = id.split("--")
  const words = (value: string) => value.split("-").filter(Boolean)
  const name = words(component)
    .slice(1)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
  const variant = words(story).join(" ")
  return `${name}${variant && variant !== "default" ? ` (${variant})` : ""} in ${PLATFORM_LABELS.rn}, ${scheme} mode`
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
  web,
  children,
}: {
  id?: string
  web?: Preview
  width?: number
  height?: number
  platforms?: string[]
  video?: boolean
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
  const missing =
    mobilePlatform !== "rn" &&
    !(codePlatforms.length ? codePlatforms : ["rn"]).includes(mobilePlatform)
  const responsive = useResponsivePreview()

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
                "relative h-9 cursor-pointer text-sm font-medium capitalize tracking-[-0.01em] outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
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
            {web ? "Web" : PLATFORM_LABELS.rn}
          </span>
        )}
      </div>
      {id && web && (
        <div hidden={tab !== "preview"}>
          {web.responsive ? (
            <ResponsivePreview
              src={withBase(`/preview/${web.name}`)}
              height={web.type === "block" ? 800 : 560}
              state={responsive}
            />
          ) : (
            <ExamplePreview
              type={web.type}
              name={web.name}
              layout={web.layout}
            />
          )}
          <p className="mt-3 text-center font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase">
            {strings.webPreview}
          </p>
        </div>
      )}
      {id && !web && (
        <div hidden={tab !== "preview"}>
          <div
            data-slot="preview"
            className="mt-[1.2em] flex flex-col items-center gap-4 overflow-hidden rounded-[24px] bg-muted px-6 py-10 ring-1 ring-foreground/10 md:py-14"
          >
            <div className="w-full max-w-[360px] overflow-hidden rounded-[28px] shadow-[0_24px_60px_-28px_rgb(0_0_0/0.35)] ring-1 ring-foreground/10">
              {(["light", "dark"] as const).map((scheme) =>
                video ? (
                  <video
                    key={scheme}
                    src={`${basePath}/previews/${id}.${scheme}.mp4`}
                    poster={`${basePath}/previews/${id}.${scheme}.webp`}
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
                    src={`${basePath}/previews/${id}.${scheme}.webp`}
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
              )}
            </div>
            {mobilePlatform !== "rn" && (
              <p className="font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase">
                {strings.nativePreview}
              </p>
            )}
          </div>
        </div>
      )}
      <CodeVisible value={tab === "code"}>
        <div hidden={tab !== "code"}>
          {missing && (
            <p className="mt-[1.2em] rounded-2xl bg-muted px-5 py-4 text-sm text-muted-foreground">
              {strings.noNativeCode(PLATFORM_LABELS[mobilePlatform])}
            </p>
          )}
          {!missing &&
            labels.length > 1 &&
            panels.map((panel, index) => (
              <div key={labels[index]} hidden={index !== active}>
                <SourceCode>{panel}</SourceCode>
              </div>
            ))}
          {!missing && labels.length < 2 && <SourceCode>{children}</SourceCode>}
        </div>
      </CodeVisible>
    </div>
  )
}
