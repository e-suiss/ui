"use client"

import { CheckIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react"
import * as React from "react"

import { Button } from "@/components/ui/button"

const EMAIL = "jamie@suiss.com"

export function VerifyEmail() {
  const [verified, setVerified] = React.useState(false)
  const [left, setLeft] = React.useState(0)

  React.useEffect(() => {
    if (left <= 0) return
    const timer = window.setTimeout(() => setLeft(left - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [left])

  if (verified) {
    return (
      <section className="flex min-h-130 items-center justify-center p-6">
        <div className="flex max-w-105 flex-col items-center gap-3.5 text-center transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-4.5 starting:opacity-0 motion-reduce:transition-none">
          <span className="flex size-19 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--green),var(--label)_25%)] text-white dark:bg-[color-mix(in_oklab,var(--green),black_35%)]">
            <CheckIcon weight="bold" className="size-9.5" />
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">
            Your email is verified.
          </h1>
          <p className="text-lg text-label-secondary">
            {EMAIL} is now your suiss Account.
          </p>
          <button
            type="button"
            onClick={() => setVerified(false)}
            className="rounded-xs text-lg text-link outline-none hover:underline focus-visible:focus-ring"
          >
            Start over ›
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="flex min-h-130 items-center justify-center p-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-18 w-24">
          <span className="absolute inset-0 flex items-center justify-center rounded-[0.875rem] bg-linear-160 from-cyan to-accent text-white shadow-[0_10px_30px_-8px_color-mix(in_oklab,var(--color-accent)_55%,transparent)]">
            <EnvelopeSimpleIcon className="size-10" />
          </span>
          <span className="absolute -end-2 -top-2 flex size-6.5 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--red),var(--label)_15%)] text-sm font-semibold text-white ring-3 ring-surface dark:bg-red">
            1<span className="sr-only">new message</span>
          </span>
        </div>
        <h1 className="mt-6.5 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Check your inbox.
        </h1>
        <p className="mt-3 max-w-110 text-lg text-label-secondary">
          We sent a verification link to{" "}
          <strong className="font-semibold text-label">{EMAIL}</strong>. Tap the
          link to activate your account.
        </p>
        <div className="mt-7.5 flex flex-wrap justify-center gap-3.5">
          <Button size="lg" onClick={() => setVerified(true)}>
            Open Mail
          </Button>
          <Button
            size="lg"
            variant="outline"
            disabled={left > 0}
            onClick={() => setLeft(45)}
            className="tabular-nums"
          >
            {left > 0 ? `Sent again · ${left}` : "Resend"}
          </Button>
        </div>
        <p className="mt-6.5 flex flex-wrap justify-center gap-x-1 text-sm text-label-secondary">
          <span>Didn't get it? Check your junk folder or</span>
          <a href="#change" className="text-link hover:underline">
            change the address ›
          </a>
        </p>
      </div>
    </section>
  )
}
