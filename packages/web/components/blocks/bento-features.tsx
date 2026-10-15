"use client"

import { BatteryFullIcon, CpuIcon } from "@phosphor-icons/react"

const photo = (id: string, width: number) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&q=80&auto=format&fit=crop`

export function BentoFeatures() {
  return (
    <section className="flex flex-col gap-5 bg-muted p-5 md:p-8">
      <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
        Why Phone Pro?
      </h2>
      <div className="grid gap-4 md:grid-cols-4 md:grid-rows-[repeat(2,minmax(15.5rem,auto))]">
        <div className="flex min-h-96 flex-col overflow-hidden rounded-3xl bg-background md:col-span-2 md:row-span-2">
          <div className="flex flex-col gap-1.5 p-6.5">
            <h3 className="text-xl leading-tight font-semibold tracking-tight">
              Fusion camera system.
            </h3>
            <p className="text-base text-muted-foreground">
              Three 48 MP cameras. 8x optical-quality zoom.
            </p>
          </div>
          <img
            src={photo("1695083691065-4f77dfd0f0d5", 900)}
            alt="A close-up of a camera lens"
            className="min-h-0 w-full flex-1 bg-secondary object-cover"
          />
        </div>
        <div className="flex flex-col gap-2.5 rounded-3xl bg-background p-6.5">
          <CpuIcon className="size-7.5 text-orange-500" />
          <p className="bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-4xl leading-none font-bold tracking-tighter text-transparent">
            S19 Pro
          </p>
          <p className="text-xl leading-tight font-semibold tracking-tight text-muted-foreground">
            The fastest chip ever in a phone.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 rounded-3xl bg-background p-6.5">
          <BatteryFullIcon className="size-7.5 text-green-500" />
          <p className="bg-linear-to-r from-green-500 to-teal-500 bg-clip-text text-4xl leading-none font-bold tracking-tighter text-transparent">
            33 hrs
          </p>
          <p className="text-xl leading-tight font-semibold tracking-tight text-muted-foreground">
            Battery life for video playback.
          </p>
        </div>
        <div className="grid min-h-62 grid-cols-2 overflow-hidden rounded-3xl bg-background md:col-span-2">
          <div className="flex flex-col justify-between gap-4 p-6.5">
            <h3 className="text-xl leading-tight font-semibold tracking-tight text-[color-mix(in_oklab,var(--color-orange-500),var(--foreground)_45%)] dark:text-orange-500">
              Cosmic Orange.
            </h3>
            <p className="text-base leading-snug text-muted-foreground">
              A unibody aluminum design, in new colors.
            </p>
          </div>
          <img
            src={photo("1714972384975-fbd4f19b1bb3", 700)}
            alt="An orange phone on a warm gradient"
            className="size-full bg-secondary object-cover"
          />
        </div>
      </div>
    </section>
  )
}
