"use client"

import { CheckIcon, KeyIcon, ScanSmileyIcon } from "@phosphor-icons/react"
import * as React from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

type Status = "idle" | "scan" | "ok" | "done"

const avatarClass =
  "bg-linear-to-br from-[oklch(0.78_0.1_250)] to-[oklch(0.6_0.15_280)] text-white dark:from-[oklch(0.78_0.1_250)] dark:to-[oklch(0.6_0.15_280)]"

function ScanGlyph({ verified }: { verified: boolean }) {
  return (
    <div className="relative size-18">
      <ScanSmileyIcon
        data-verified={verified ? "" : undefined}
        className="absolute inset-0 size-full animate-[pulse_1.2s_ease-in-out_infinite] text-label transition-[opacity,scale] duration-500 data-verified:scale-60 data-verified:animate-none data-verified:opacity-0 motion-reduce:animate-none"
        weight="light"
      />
      <span
        data-verified={verified ? "" : undefined}
        className="absolute inset-1.5 flex scale-40 items-center justify-center rounded-full bg-green text-white opacity-0 transition-[opacity,scale] duration-[300ms,550ms] ease-[ease,cubic-bezier(0.3,1.25,0.5,1)] data-verified:scale-100 data-verified:opacity-100"
      >
        <CheckIcon weight="bold" className="size-8" />
      </span>
    </div>
  )
}

export function LoginPasskey() {
  const [status, setStatus] = React.useState<Status>("idle")
  const timers = React.useRef<number[]>([])

  const clear = () => {
    for (const timer of timers.current) window.clearTimeout(timer)
    timers.current = []
  }

  React.useEffect(
    () => () => {
      for (const timer of timers.current) window.clearTimeout(timer)
    },
    []
  )

  const start = () => {
    setStatus("scan")
    timers.current.push(
      window.setTimeout(() => setStatus("ok"), 1500),
      window.setTimeout(() => setStatus("done"), 2400)
    )
  }

  const cancel = () => {
    clear()
    setStatus("idle")
  }

  if (status === "done") {
    return (
      <section className="flex min-h-150 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3.5 text-center transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-4.5 starting:opacity-0 motion-reduce:transition-none">
          <Avatar className="size-21">
            <AvatarFallback className={`${avatarClass} text-3xl`}>
              JR
            </AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Welcome, Jamie.
          </h1>
          <p className="text-lg text-label-secondary">
            You signed in with a passkey. No password needed.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="rounded-xs text-lg text-link outline-none hover:underline focus-visible:focus-ring"
          >
            Sign out ›
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="flex min-h-150 items-center justify-center p-6">
      <div className="flex max-w-140 flex-col items-center text-center">
        <span className="flex size-18 items-center justify-center rounded-full bg-surface-secondary text-accent">
          <KeyIcon weight="bold" className="size-8.5" />
        </span>
        <h1 className="mt-5.5 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Sign in without a password.
        </h1>
        <p className="mt-3 max-w-120 text-xl text-balance text-label-secondary">
          With a passkey, your face or fingerprint is all it takes. Nothing to
          remember, nothing to type.
        </p>
        <div className="mt-7 flex items-center gap-2.5 rounded-full bg-surface-secondary py-2 ps-2 pe-4">
          <Avatar size="sm" className="size-7">
            <AvatarFallback className={`${avatarClass} text-3xs`}>
              JR
            </AvatarFallback>
          </Avatar>
          <span className="text-base">jamie@suiss.com</span>
          <a href="#change" className="text-sm text-link hover:underline">
            Change ›
          </a>
        </div>
        <Button size="lg" onClick={start} className="mt-5.5 gap-2">
          <ScanSmileyIcon className="size-4.5" />
          Continue with passkey
        </Button>
        <a
          href="#password"
          className="mt-4.5 text-sm text-link hover:underline"
        >
          Sign in with password ›
        </a>
        <p className="mt-10 max-w-105 text-xs leading-normal text-label-secondary">
          Passkeys are end-to-end encrypted and sync across all your devices
          with suiss Keychain.
        </p>
      </div>
      <Dialog
        open={status === "scan" || status === "ok"}
        onOpenChange={(open) => {
          if (!open) cancel()
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="flex w-65 flex-col items-center gap-3.5 rounded-3xl bg-surface-raised/82 px-6 pt-7.5 pb-4.5 text-center backdrop-blur-2xl backdrop-saturate-180 data-open:zoom-in-90 sm:max-w-65"
        >
          <ScanGlyph verified={status === "ok"} />
          <div className="flex flex-col gap-0.75">
            <DialogTitle className="text-lg font-semibold">
              {status === "ok" ? "Verified" : "Face scan"}
            </DialogTitle>
            <DialogDescription className="text-sm text-label-secondary">
              Passkey for suiss.com
            </DialogDescription>
          </div>
          <DialogClose
            render={
              <Button
                variant="plain"
                data-hidden={status === "ok" ? "" : undefined}
                className="text-base data-hidden:invisible"
              />
            }
          >
            Cancel
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  )
}
