"use client"

import {
  CheckIcon,
  DeviceMobileIcon,
  LockSimpleIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"

const DEMO_CODE = "482913"

const backdrop =
  "https://images.unsplash.com/photo-1714578187196-29775454aa39?w=900&q=80&auto=format&fit=crop"

type Phase = "ask" | "code" | "deny" | "ok"

const copy = {
  ask: {
    title: "Approve from your other device.",
    body: "We sent a sign-in request to your trusted devices. Tap Allow on the alert to the right.",
  },
  code: {
    title: "Enter the verification code.",
    body: "Type the 6-digit code shown on your trusted device.",
  },
  deny: {
    title: "Sign-in denied.",
    body: "If this wasn't you, your account is safe. There's nothing else you need to do.",
  },
}

const slotClass =
  "h-14 w-11 rounded-xl sm:h-15.5 sm:w-12.5 border border-separator-strong bg-transparent text-3xl data-[active=true]:border-accent data-[active=true]:ring-3 data-[active=true]:ring-accent/25 group-data-[status=error]/code:border-danger"

function AlertAction({
  children,
  primary,
  onClick,
}: {
  children: React.ReactNode
  primary?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-primary={primary ? "" : undefined}
      className="h-11 w-full border-t border-separator-strong text-lg text-link outline-none hover:bg-item-hover focus-visible:bg-item-hover data-primary:font-semibold"
    >
      {children}
    </button>
  )
}

export function VerifyDevice() {
  const [phase, setPhase] = React.useState<Phase>("ask")
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState(false)

  if (phase === "ok") {
    return (
      <section className="flex min-h-150 items-center justify-center p-6">
        <div className="flex max-w-105 flex-col items-center gap-3.5 text-center transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-4.5 starting:opacity-0 motion-reduce:transition-none">
          <span className="flex size-19 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--green),var(--label)_25%)] text-white dark:bg-[color-mix(in_oklab,var(--green),black_35%)]">
            <CheckIcon weight="bold" className="size-9.5" />
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">
            Sign-in approved.
          </h1>
          <p className="text-lg text-label-secondary">
            This browser was added to your suiss Account.
          </p>
          <button
            type="button"
            onClick={() => {
              setCode("")
              setPhase("ask")
            }}
            className="rounded-xs text-lg text-link outline-none hover:underline focus-visible:focus-ring"
          >
            Start over ›
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="grid min-h-150 bg-surface md:grid-cols-2">
      <div className="flex flex-col justify-center gap-3.5 px-6 py-12 md:px-12">
        <span className="flex size-14 items-center justify-center rounded-full bg-surface-secondary text-accent">
          {phase === "code" ? (
            <LockSimpleIcon weight="bold" className="size-6.5" />
          ) : (
            <DeviceMobileIcon weight="bold" className="size-6.5" />
          )}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-balance">
          {copy[phase].title}
        </h1>
        <p className="max-w-95 text-lg text-label-secondary">
          {copy[phase].body}
        </p>
        <div className="mt-2.5 min-h-16" aria-live="polite">
          {phase === "code" && (
            <div className="transition-[opacity,translate] duration-800 starting:translate-y-1.5 starting:opacity-0 motion-reduce:transition-none">
              <InputOTP
                autoFocus
                maxLength={6}
                value={code}
                onChange={(value) => {
                  setCode(value)
                  setError(false)
                }}
                onComplete={(value) => {
                  if (value === DEMO_CODE) return setPhase("ok")
                  setError(true)
                  window.setTimeout(() => setCode(""), 800)
                }}
                aria-label="Verification code"
              >
                <InputOTPGroup
                  data-status={error ? "error" : "idle"}
                  className="group/code gap-2.5"
                >
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={slotClass}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {error && (
                <p className="mt-2.5 text-sm text-danger">Incorrect code.</p>
              )}
            </div>
          )}
          {phase === "ask" && (
            <p className="flex items-center gap-2.5 text-sm text-label-secondary">
              <Spinner />
              Waiting for approval…
            </p>
          )}
          {phase === "deny" && (
            <button
              type="button"
              onClick={() => setPhase("ask")}
              className="rounded-xs text-base text-link outline-none hover:underline focus-visible:focus-ring"
            >
              Try again ›
            </button>
          )}
        </div>
      </div>
      <div className="relative flex min-h-110 items-center justify-center overflow-hidden p-6">
        <div
          aria-hidden
          style={{ backgroundImage: `url(${backdrop})` }}
          className="absolute -inset-5 bg-cover bg-center opacity-85 blur-lg saturate-120"
        />
        <div aria-hidden className="absolute inset-0 bg-black/18" />
        <div
          key={phase}
          role="alertdialog"
          aria-label="Trusted device"
          className="relative w-67.5 overflow-hidden rounded-[0.875rem] bg-surface-raised/86 text-center text-label shadow-[0_20px_60px_rgb(0_0_0/0.3)] backdrop-blur-2xl backdrop-saturate-180 transition-[opacity,translate] duration-800 starting:translate-y-1.5 starting:opacity-0 motion-reduce:transition-none"
        >
          {phase === "code" && (
            <>
              <div className="px-4 pt-5 pb-4.5">
                <p className="text-lg font-semibold">
                  suiss Account Verification Code
                </p>
                <p className="mt-2.5 mb-1 text-4xl font-semibold tracking-widest tabular-nums">
                  482 913
                </p>
                <p className="text-sm leading-snug text-label-secondary">
                  Enter this code in the browser you're signing in to.
                </p>
              </div>
              <AlertAction primary>OK</AlertAction>
            </>
          )}
          {phase === "deny" && (
            <>
              <div className="px-4 pt-5 pb-4.5">
                <p className="text-lg font-semibold">Sign-in blocked</p>
                <p className="mt-1 text-sm text-label-secondary">
                  If this wasn't you, change your password.
                </p>
              </div>
              <AlertAction onClick={() => setPhase("ask")}>
                Show request again
              </AlertAction>
            </>
          )}
          {phase === "ask" && (
            <>
              <div className="px-4 pt-5 pb-4">
                <p className="text-lg font-semibold">
                  suiss Account Sign-in Requested
                </p>
                <p className="mt-1 text-sm leading-snug text-label-secondary">
                  Your suiss Account is being used to sign in to a browser near
                  San Francisco.
                </p>
                <div
                  aria-hidden
                  className="mt-3.5 h-24 rounded-[0.625rem] bg-[radial-gradient(circle_at_50%_52%,var(--color-accent)_0_5px,color-mix(in_oklab,var(--color-accent)_25%,transparent)_6px_24px,transparent_25px),linear-gradient(135deg,oklch(0.9_0.03_140),oklch(0.88_0.03_230))]"
                />
              </div>
              <AlertAction primary onClick={() => setPhase("code")}>
                Allow
              </AlertAction>
              <AlertAction onClick={() => setPhase("deny")}>
                Don't Allow
              </AlertAction>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
