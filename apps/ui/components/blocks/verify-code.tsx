"use client"

import { CheckIcon, LockSimpleIcon } from "@phosphor-icons/react"
import * as React from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const DEMO_CODE = "482913"

const SHAKE = [0, -10, 9, -6, 4, 0].map((x) => ({
  transform: `translateX(${x}px)`,
}))

const slotClass =
  "h-14 w-11 rounded-xl sm:h-15.5 sm:w-12.5 border border-separator-strong bg-transparent text-3xl transition-[border-color,box-shadow,scale] duration-250 ease-[cubic-bezier(0.3,1.25,0.5,1)] data-[active=true]:border-accent data-[active=true]:ring-3 data-[active=true]:ring-accent/25 group-data-[status=error]/code:border-danger group-data-[status=ok]/code:border-green"

export function VerifyCode() {
  const [code, setCode] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "error" | "ok">("idle")
  const [left, setLeft] = React.useState(30)
  const groupRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (left <= 0) return
    const timer = window.setTimeout(() => setLeft(left - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [left])

  const complete = (value: string) => {
    window.setTimeout(() => {
      if (value === DEMO_CODE) return setStatus("ok")
      setStatus("error")
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        groupRef.current?.animate(SHAKE, { duration: 420, easing: "ease-out" })
      window.setTimeout(() => {
        setCode("")
        setStatus("idle")
      }, 800)
    }, 200)
  }

  if (status === "ok") {
    return (
      <section className="flex min-h-140 items-center justify-center p-6">
        <div className="flex max-w-105 flex-col items-center gap-3.5 text-center transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-4.5 starting:opacity-0 motion-reduce:transition-none">
          <span className="flex size-19 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--green),var(--label)_25%)] text-white dark:bg-[color-mix(in_oklab,var(--green),black_35%)]">
            <CheckIcon weight="bold" className="size-9.5" />
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">Verified.</h1>
          <p className="text-lg text-label-secondary">
            This browser is now trusted. You won't be asked for a code next
            time.
          </p>
          <button
            type="button"
            onClick={() => {
              setCode("")
              setStatus("idle")
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
    <section className="flex min-h-140 items-center justify-center p-6">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-surface-secondary text-accent">
          <LockSimpleIcon weight="bold" className="size-7.5" />
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Two-factor authentication
        </h1>
        <p className="mt-3 mb-7.5 max-w-110 text-lg text-label-secondary">
          Enter the 6-digit code sent to your trusted devices.
        </p>
        <div ref={groupRef}>
          <InputOTP
            autoFocus
            maxLength={6}
            value={code}
            onChange={(value) => {
              setCode(value)
              setStatus("idle")
            }}
            onComplete={complete}
            aria-label="Verification code"
            aria-describedby="verify-code-hint"
          >
            <div data-status={status} className="group/code flex gap-4">
              <InputOTPGroup className="gap-2.5">
                {[0, 1, 2].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className={slotClass}
                  />
                ))}
              </InputOTPGroup>
              <InputOTPGroup className="gap-2.5">
                {[3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className={slotClass}
                  />
                ))}
              </InputOTPGroup>
            </div>
          </InputOTP>
        </div>
        <p
          id="verify-code-hint"
          aria-live="polite"
          data-status={status}
          className="mt-3.5 min-h-5 text-sm text-label-secondary data-[status=error]:text-danger"
        >
          {status === "error" ? "Incorrect code." : `Demo code: ${DEMO_CODE}`}
        </p>
        <div className="mt-6 flex flex-col items-center gap-2.5 text-sm">
          {left > 0 ? (
            <span className="text-label-secondary tabular-nums">
              Resend code · 0:{String(left).padStart(2, "0")}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setLeft(30)}
              className="rounded-xs text-link outline-none hover:underline focus-visible:focus-ring"
            >
              Resend code ›
            </button>
          )}
          <a href="#help" className="text-link hover:underline">
            Didn't get a verification code? ›
          </a>
        </div>
      </div>
    </section>
  )
}
