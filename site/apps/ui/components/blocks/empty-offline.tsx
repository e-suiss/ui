"use client"

import { WifiSlashIcon } from "@phosphor-icons/react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&q=80&auto=format&fit=crop`

const albums = [
  { title: "Orange Hour", image: photo("1633596683562-4a47eb4983c5") },
  { title: "Soft Shapes", image: photo("1645323927877-3de25b4f819c") },
  { title: "Low Light", image: photo("1760978631841-f3754859ca59") },
  { title: "Waves", image: photo("1707324148764-99647364afa3") },
]

export function EmptyOffline() {
  const [state, setState] = React.useState<"offline" | "loading" | "online">(
    "offline"
  )

  React.useEffect(() => {
    if (state !== "loading") return
    const timer = window.setTimeout(() => setState("online"), 1400)
    return () => window.clearTimeout(timer)
  }, [state])

  if (state === "online") {
    return (
      <section className="flex min-h-120 flex-col gap-4 px-5 py-7.5 md:px-10">
        <div className="flex flex-col gap-4 transition-[opacity,translate] duration-800 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none">
          <div className="flex items-center gap-2">
            <h1 className="flex-1 text-3xl font-semibold">suiss Music</h1>
            <button
              type="button"
              onClick={() => setState("offline")}
              className="rounded-xs text-sm text-link outline-none hover:underline focus-visible:focus-ring"
            >
              Disconnect ›
            </button>
          </div>
          <ul className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
            {albums.map((album) => (
              <li key={album.title} className="flex flex-col gap-1.5">
                <img
                  src={album.image}
                  alt=""
                  className="aspect-square w-full rounded-xl bg-control object-cover"
                />
                <span className="text-sm font-semibold">{album.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  return (
    <section className="flex min-h-120 items-center justify-center p-6">
      <Empty className="gap-5 p-0">
        <EmptyHeader className="max-w-95 gap-3.5">
          <EmptyMedia className="mb-0 text-label-tertiary">
            <WifiSlashIcon weight="light" className="size-13" />
          </EmptyMedia>
          <EmptyTitle className="text-3xl tracking-tight">
            You're not connected to the internet.
          </EmptyTitle>
          <EmptyDescription className="text-lg/normal">
            Turn on Wi-Fi or cellular data. Songs you downloaded still play
            offline.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-3.5">
          <Button
            size="lg"
            onClick={() => setState("loading")}
            disabled={state === "loading"}
            aria-live="polite"
          >
            {state === "loading" && <Spinner />}
            {state === "loading" ? "Connecting" : "Try Again"}
          </Button>
          <Button size="lg" variant="outline">
            Downloads
          </Button>
        </EmptyContent>
      </Empty>
    </section>
  )
}
