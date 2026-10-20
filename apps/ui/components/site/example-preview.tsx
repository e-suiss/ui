"use client"

import * as React from "react"
import { PreviewIconsProvider } from "@/components/site/icon-placeholder"
import { ScrollArea } from "@/components/ui/scroll-area"
import { loadPreview } from "@/lib/load-preview"
import type { PreviewLayout, PreviewType } from "@/lib/previews"
import { cn } from "@/lib/utils"

class Boundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) {
      return (
        <p className="font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase">
          Preview unavailable
        </p>
      )
    }
    return <PreviewIconsProvider>{this.props.children}</PreviewIconsProvider>
  }
}

function useFitOverflow(ref: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const frame = ref.current
    if (!frame) return
    let queued = 0
    const fit = () => {
      queued = 0
      frame.style.minHeight = ""
      const overflow = frame.scrollHeight - frame.clientHeight
      if (overflow > 1)
        frame.style.minHeight = `${frame.offsetHeight + overflow}px`
    }
    const schedule = () => {
      if (!queued) queued = requestAnimationFrame(fit)
    }
    const events = [
      "pointerup",
      "transitionend",
      "animationend",
      "click",
      "keyup",
    ] as const
    for (const type of events) frame.addEventListener(type, schedule)
    schedule()
    return () => {
      cancelAnimationFrame(queued)
      for (const type of events) frame.removeEventListener(type, schedule)
    }
  }, [ref])
}

function useNearViewport<T extends Element>() {
  const ref = React.useRef<T>(null)
  const [near, setNear] = React.useState(false)
  React.useEffect(() => {
    const element = ref.current
    if (!element || near) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true)
      },
      { rootMargin: "800px 0px" }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [near])
  return [ref, near] as const
}

function Frame({
  wide,
  layout = "centered",
  children,
}: {
  wide?: boolean
  layout?: PreviewLayout
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  useFitOverflow(ref)
  return (
    <div data-not-prose className="mt-[1.2em] flex flex-col gap-3">
      <div
        ref={ref}
        data-slot="preview"
        className={cn(
          "overflow-hidden rounded-[24px]",
          "bg-background ring-1 ring-foreground/10",
          !wide &&
            layout === "centered" &&
            "flex min-h-56 flex-wrap items-center justify-center gap-3 p-10",
          !wide &&
            layout === "top" &&
            "flex min-h-56 flex-wrap items-start justify-center gap-3 p-10",
          !wide && layout === "padded" && "min-h-56 p-6"
        )}
      >
        <Boundary>{children}</Boundary>
      </div>
    </div>
  )
}

function Loading({ wide }: { wide?: boolean }) {
  return (
    <div
      data-not-prose
      className={cn(
        "mt-[1.2em] animate-pulse rounded-[24px] bg-muted",
        wide ? "h-96" : "h-56"
      )}
    />
  )
}

function useLoaded(type: PreviewType, name: string) {
  const [Component, setComponent] = React.useState<React.ComponentType>()
  React.useEffect(() => {
    loadPreview(type, name).then((loaded) => setComponent(() => loaded))
  }, [type, name])
  return Component
}

function Loaded({
  type,
  name,
  layout,
}: {
  type: PreviewType
  name: string
  layout: PreviewLayout
}) {
  const Component = useLoaded(type, name)
  const wide = type === "block"
  if (!Component) return <Loading wide={wide} />
  if (type === "example")
    return (
      <Frame layout={layout}>
        <Component />
      </Frame>
    )
  return (
    <Frame wide={wide}>
      {wide ? (
        <Component />
      ) : (
        <div className="w-full max-w-xl">
          <Component />
        </div>
      )}
    </Frame>
  )
}

export function ExamplePreview({
  type,
  name,
  layout,
}: {
  type: PreviewType
  name: string
  layout: PreviewLayout
}) {
  const [ref, near] = useNearViewport<HTMLDivElement>()
  if (!near) {
    return (
      <div ref={ref}>
        <Loading wide={type === "block"} />
      </div>
    )
  }
  return <Loaded type={type} name={name} layout={layout} />
}

export function PreviewCanvas({
  type,
  name,
  layout,
}: {
  type: PreviewType
  name: string
  layout: PreviewLayout
}) {
  const Component = useLoaded(type, name)
  if (!Component) return null

  if (type !== "example") {
    return (
      <ScrollArea className="h-svh">
        <div className="grid min-h-svh grid-cols-[minmax(0,1fr)] *:md:h-auto">
          <Boundary>
            <Component />
          </Boundary>
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className="h-svh">
      <div
        className={cn(
          "min-h-svh",
          layout === "centered" &&
            "flex flex-wrap items-center justify-center gap-3 p-6 sm:p-10",
          layout === "top" &&
            "flex flex-wrap items-start justify-center gap-3 p-6 sm:p-10",
          layout === "padded" && "p-4 sm:p-6"
        )}
      >
        <Boundary>
          <Component />
        </Boundary>
      </div>
    </ScrollArea>
  )
}
