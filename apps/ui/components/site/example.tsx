"use client"

import * as React from "react"
import { ExamplePreview } from "@/components/site/example-preview"
import { CodeVisible } from "@/components/site/lazy-source"
import {
  ResponsivePreview,
  ResponsiveToolbar,
  useResponsivePreview,
} from "@/components/site/responsive-preview"
import { SourceCode } from "@/components/site/source-code"
import { withBase } from "@/lib/base-path"
import type { Preview } from "@/lib/previews"
import { cn } from "@/lib/utils"

export function Example({
  preview: { type, name, layout, responsive },
  children,
}: {
  preview: Preview
  children: React.ReactNode
}) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview")
  const state = useResponsivePreview()
  const src = withBase(`/preview/${name}`)

  return (
    <div data-not-prose className="mt-[1.2em]">
      <div role="tablist" className="flex gap-5 border-b border-foreground/12">
        {(["preview", "code"] as const).map((item) => (
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
        ))}
        {responsive && (
          <ResponsiveToolbar
            src={src}
            state={state}
            onSelect={() => setTab("preview")}
          />
        )}
      </div>
      <div hidden={tab !== "preview"}>
        {responsive ? (
          <ResponsivePreview
            src={src}
            height={type === "block" ? 800 : 560}
            state={state}
          />
        ) : (
          <ExamplePreview type={type} name={name} layout={layout} />
        )}
      </div>
      <div hidden={tab !== "code"}>
        <CodeVisible value={tab === "code"}>
          <SourceCode>{children}</SourceCode>
        </CodeVisible>
      </div>
    </div>
  )
}
