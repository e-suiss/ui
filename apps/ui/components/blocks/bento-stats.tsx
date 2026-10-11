"use client"

import * as React from "react"

import { Progress } from "@/components/ui/progress"

const image =
  "https://images.unsplash.com/photo-1760978631841-f3754859ca59?w=900&q=80&auto=format&fit=crop"

export function BentoStats() {
  const [charge, setCharge] = React.useState(0)

  React.useEffect(() => {
    const timer = window.setTimeout(() => setCharge(50), 400)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <section className="dark flex flex-col gap-5 bg-surface p-5 text-label md:p-8">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold text-label-secondary">
          At a glance
        </p>
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
          The full power of Pro.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-[1.3fr_1fr_1fr] md:grid-rows-[repeat(2,minmax(14.5rem,auto))]">
        <div
          style={{ backgroundImage: `url(${image})` }}
          className="relative flex min-h-96 flex-col justify-end overflow-hidden rounded-3xl bg-surface-secondary bg-cover bg-center md:row-span-2"
        >
          <div className="bg-linear-to-b from-transparent to-black/85 p-6.5 pt-24">
            <h3 className="text-3xl leading-tight font-semibold tracking-tight">
              After titanium, aluminum.
            </h3>
            <p className="mt-1.5 text-base text-label-secondary">
              Cooler and faster with vapor chamber cooling.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-3xl bg-surface-secondary p-6.5">
          <p className="text-base text-label-secondary">Zoom</p>
          <p className="bg-linear-135 from-orange from-30% to-red bg-clip-text text-7xl leading-none font-bold tracking-tighter text-transparent">
            8x
          </p>
          <p className="text-base text-label-secondary">optical quality</p>
        </div>
        <div className="flex flex-col gap-2 rounded-3xl bg-surface-secondary p-6.5">
          <p className="text-base text-label-secondary">Video</p>
          <p className="bg-linear-135 from-cyan to-indigo bg-clip-text text-6xl leading-none font-bold tracking-tighter text-transparent">
            4K 120
          </p>
          <p className="text-base text-label-secondary">
            fps with Dolby Vision
          </p>
        </div>
        <div className="flex flex-col gap-6 rounded-3xl bg-surface-secondary p-6.5 sm:flex-row sm:items-center md:col-span-2">
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-base text-label-secondary">Charging</p>
            <h3 className="text-3xl font-semibold tracking-tight">
              50% in 20 minutes.
            </h3>
            <p className="text-base text-label-secondary">
              With a 40 W adapter or higher.
            </p>
          </div>
          <Progress
            value={charge}
            aria-label="Charge after 20 minutes"
            className="w-full sm:w-45 **:data-[slot=progress-indicator]:rounded-full **:data-[slot=progress-indicator]:bg-linear-to-r **:data-[slot=progress-indicator]:from-green **:data-[slot=progress-indicator]:to-mint **:data-[slot=progress-indicator]:duration-1600 **:data-[slot=progress-indicator]:ease-[cubic-bezier(0.32,0.72,0,1)] **:data-[slot=progress-track]:h-3.5 **:data-[slot=progress-track]:bg-control motion-reduce:**:data-[slot=progress-indicator]:transition-none"
          />
        </div>
      </div>
    </section>
  )
}
