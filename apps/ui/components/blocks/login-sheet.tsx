"use client"

import { EnvelopeSimpleIcon, UserIcon, XIcon } from "@phosphor-icons/react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"

export function LoginSheet() {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("hide")
  const [busy, setBusy] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const titleId = React.useId()

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  React.useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  const proceed = () => {
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      setOpen(false)
      setDone(true)
    }, 1000)
  }

  return (
    <section className="flex min-h-175 items-center justify-center bg-surface-secondary sm:px-6 sm:py-7">
      <div className="relative flex min-h-175 w-full flex-col overflow-hidden bg-surface sm:h-160 sm:min-h-0 sm:w-85 sm:rounded-[2.75rem] sm:shadow-[0_0_0_10px_var(--color-label),0_0_0_11px_var(--color-label-secondary),0_30px_70px_rgb(0_0_0/0.3)] dark:sm:shadow-[0_0_0_10px_var(--color-surface-tertiary),0_0_0_11px_var(--color-separator-strong),0_30px_70px_rgb(0_0_0/0.5)]">
        <span
          aria-hidden
          className="absolute top-2.5 left-1/2 z-10 hidden h-7.5 w-27.5 -translate-x-1/2 rounded-full bg-black sm:block"
        />
        <div
          inert={open}
          className="flex flex-1 flex-col items-center px-7 pt-22.5 pb-8.5 text-center"
        >
          <span className="mb-5 size-21 rounded-[1.25rem] bg-linear-160 from-[oklch(0.75_0.15_150)] to-[oklch(0.55_0.15_180)]" />
          <h1 className="text-3xl font-semibold tracking-tight">
            {done ? "Welcome, Jamie" : "Trail Routes"}
          </h1>
          <p className="mt-2 text-base text-label-secondary">
            {done
              ? "Your account was created with suiss."
              : "Save your routes and share them with friends."}
          </p>
          <div className="flex-1" />
          {done ? (
            <button
              type="button"
              onClick={() => setDone(false)}
              className="rounded-xs text-base text-link outline-none hover:underline focus-visible:focus-ring"
            >
              Sign out ›
            </button>
          ) : (
            <div className="flex w-full flex-col gap-2.5">
              <Button
                ref={triggerRef}
                size="xl"
                block
                onClick={() => setOpen(true)}
                className="h-12.5 bg-label text-lg font-semibold text-surface hover:bg-label/90 active:bg-label/80"
              >
                Sign in with suiss
              </Button>
              <Button
                size="xl"
                block
                variant="secondary"
                className="h-12.5 text-lg font-semibold"
              >
                Continue with email
              </Button>
            </div>
          )}
        </div>
        <div
          aria-hidden
          data-open={open ? "" : undefined}
          onClick={close}
          className="pointer-events-none absolute inset-0 bg-scrim/35 opacity-0 transition-opacity duration-300 data-open:pointer-events-auto data-open:opacity-100"
        />
        <div
          role="dialog"
          aria-modal
          aria-labelledby={titleId}
          inert={!open}
          data-open={open ? "" : undefined}
          className="absolute inset-x-0 bottom-0 flex translate-y-[105%] flex-col gap-3.5 rounded-t-3xl bg-surface-raised px-5 pt-3.5 pb-7.5 transition-transform duration-500 ease-[cubic-bezier(0.3,1.15,0.5,1)] data-open:translate-y-0 motion-reduce:transition-none"
        >
          <div className="flex items-center">
            <span className="w-7" />
            <span className="flex-1 text-center text-lg font-bold tracking-tight">
              suiss
            </span>
            <Button
              ref={closeRef}
              variant="secondary"
              size="icon-sm"
              aria-label="Close"
              onClick={close}
              className="size-7 text-label-secondary"
            >
              <XIcon weight="bold" className="size-3.5" />
            </Button>
          </div>
          <h2
            id={titleId}
            className="text-center text-2xl leading-tight font-semibold tracking-tight text-balance"
          >
            Use your suiss Account with Trail Routes
          </h2>
          <div className="rounded-xl bg-surface-secondary">
            <div className="flex items-center gap-3 px-3.5 py-2.5">
              <UserIcon className="size-5 text-label-secondary" />
              <div className="flex flex-col text-start">
                <span className="text-xs text-label-secondary">Name</span>
                <span className="text-base">Jamie Rivera</span>
              </div>
            </div>
            <div className="ms-11.5 h-px bg-separator" />
            <RadioGroup
              value={email}
              onValueChange={(value) => setEmail(value as string)}
              aria-label="Email"
              className="gap-0"
            >
              {[
                {
                  value: "share",
                  label: "Share My Email",
                  hint: "jamie@suiss.com",
                },
                {
                  value: "hide",
                  label: "Hide My Email",
                  hint: "A unique address that forwards to you",
                },
              ].map((option, index) => (
                <Label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 py-2.5 pe-3.5 data-[index='0']:ps-3.5 data-[index='1']:ms-11.5 data-[index='1']:border-t data-[index='1']:border-separator"
                  data-index={index}
                >
                  {index === 0 && (
                    <EnvelopeSimpleIcon className="size-5 text-label-secondary" />
                  )}
                  <span className="flex flex-1 flex-col text-start">
                    <span className="text-base">{option.label}</span>
                    <span className="text-xs text-label-secondary">
                      {option.hint}
                    </span>
                  </span>
                  <RadioGroupItem value={option.value} className="size-5.5" />
                </Label>
              ))}
            </RadioGroup>
          </div>
          <Button
            size="xl"
            block
            onClick={proceed}
            disabled={busy}
            className="h-12.5 text-lg font-semibold"
          >
            {busy ? <Spinner className="size-5" /> : "Continue with face scan"}
          </Button>
        </div>
      </div>
    </section>
  )
}
