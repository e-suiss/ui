"use client"

import { ArrowRightIcon } from "@phosphor-icons/react"
import * as React from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

const EMAIL = /.+@.+\..+/

const SHAKE = [0, -10, 9, -6, 4, 0].map((x) => ({
  transform: `translateX(${x}px)`,
}))

function SubmitArrow({ ready, busy }: { ready: boolean; busy: boolean }) {
  return (
    <Button
      type="submit"
      variant="outline"
      size="icon-sm"
      aria-label="Continue"
      disabled={!ready || busy}
      className="me-2.5 size-7.5 border-[1.5px] border-label-secondary bg-transparent text-label-secondary disabled:border-label-quaternary dark:bg-transparent"
    >
      {busy ? (
        <Spinner />
      ) : (
        <ArrowRightIcon weight="bold" className="size-3.5 rtl:rotate-180" />
      )}
    </Button>
  )
}

export function LoginAccount() {
  const [step, setStep] = React.useState<"email" | "password">("email")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [signedIn, setSignedIn] = React.useState(false)
  const fieldsRef = React.useRef<HTMLDivElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  const fail = (message: string) => {
    setError(message)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    fieldsRef.current?.animate(SHAKE, { duration: 420, easing: "ease-out" })
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (step === "email") {
      if (!EMAIL.test(email)) return fail("Enter a valid suiss Account.")
      setError("")
      setStep("password")
      window.setTimeout(() => passwordRef.current?.focus(), 380)
      return
    }
    if (password.length < 4)
      return fail("Your suiss Account or password was incorrect.")
    setError("")
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      setSignedIn(true)
    }, 1200)
  }

  if (signedIn) {
    return (
      <section className="flex min-h-150 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3.5 text-center transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-4.5 starting:opacity-0 motion-reduce:transition-none">
          <Avatar className="size-20">
            <AvatarFallback className="bg-none bg-surface-secondary text-3xl text-label">
              {email[0]}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-5xl font-semibold tracking-tight">Hello.</h1>
          <p className="text-lg text-label-secondary">{email}</p>
          <button
            type="button"
            onClick={() => {
              setSignedIn(false)
              setStep("email")
              setPassword("")
            }}
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
      <form
        noValidate
        onSubmit={submit}
        className="flex w-115 max-w-full flex-col items-center text-center"
      >
        <h1 className="mb-8 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Sign in with your suiss Account
        </h1>
        <div
          ref={fieldsRef}
          data-invalid={error ? "" : undefined}
          className="w-full overflow-hidden rounded-xl border border-separator-strong bg-surface text-start transition-[border-color,background-color] duration-200 has-focus-visible:focus-ring data-invalid:border-danger data-invalid:bg-danger/5 dark:data-invalid:bg-danger/10"
        >
          <div className="flex items-center">
            <Input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError("")
                if (step === "password") setStep("email")
              }}
              placeholder="Email or phone number"
              aria-label="Email or phone number"
              aria-invalid={(step === "email" && !!error) || undefined}
              aria-describedby="login-account-error"
              autoComplete="username"
              className="h-14 rounded-none bg-transparent px-4 text-lg [--focus-ring-width:0px] aria-invalid:border-transparent aria-invalid:bg-transparent dark:aria-invalid:bg-transparent"
            />
            {step === "email" && <SubmitArrow ready={!!email} busy={busy} />}
          </div>
          <div
            data-open={step === "password" ? "" : undefined}
            className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-open:grid-rows-[1fr] motion-reduce:transition-none"
          >
            <div className="min-h-0 overflow-hidden">
              <div className="flex items-center border-t border-separator-strong">
                <Input
                  ref={passwordRef}
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setError("")
                  }}
                  placeholder="Password"
                  aria-label="Password"
                  aria-invalid={(step === "password" && !!error) || undefined}
                  aria-describedby="login-account-error"
                  autoComplete="current-password"
                  tabIndex={step === "password" ? 0 : -1}
                  className="h-14 rounded-none bg-transparent px-4 text-lg [--focus-ring-width:0px] aria-invalid:border-transparent aria-invalid:bg-transparent dark:aria-invalid:bg-transparent"
                />
                <SubmitArrow ready={!!password} busy={busy} />
              </div>
            </div>
          </div>
        </div>
        <p
          id="login-account-error"
          aria-live="polite"
          className="mt-2.5 min-h-5.5 text-sm text-danger"
        >
          {error}
        </p>
        <Label className="mt-1.5 cursor-pointer gap-2 text-sm font-normal">
          <Checkbox defaultChecked />
          Remember me
        </Label>
        <div className="mt-10 flex flex-col items-center gap-2.5 text-sm">
          <a href="#forgot" className="text-link hover:underline">
            Forgot password? ›
          </a>
          <p className="flex flex-wrap justify-center gap-x-1 text-label-secondary">
            <span>Don't have a suiss Account?</span>
            <a href="#create" className="text-link hover:underline">
              Create yours now ›
            </a>
          </p>
        </div>
      </form>
    </section>
  )
}
