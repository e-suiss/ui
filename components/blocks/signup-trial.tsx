"use client"

import { CheckIcon, MusicNotesIcon } from "@phosphor-icons/react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMAIL = /.+@.+\..+/
const UPPERCASE = /[A-Z]/
const LOWERCASE = /[a-z]/
const DIGIT = /\d/
const SYMBOL = /[^A-Za-z0-9]/

const image =
  "https://images.unsplash.com/photo-1599669454699-248893623440?w=1200&q=80&auto=format&fit=crop"

const levels = [
  "bg-red",
  "bg-orange",
  "bg-yellow",
  "bg-green",
  "bg-green",
] as const

const strength = (value: string) =>
  [
    value.length >= 8,
    UPPERCASE.test(value) && LOWERCASE.test(value),
    DIGIT.test(value),
    SYMBOL.test(value),
  ].filter(Boolean).length

const strengthLabel = ["Weak", "Weak", "Fair", "Good", "Strong"]

export function SignupTrial() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [terms, setTerms] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const score = strength(password)
  const valid = EMAIL.test(email) && score >= 3 && terms

  if (done) {
    return (
      <section className="flex min-h-140 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3.5 text-center transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-4.5 starting:opacity-0 motion-reduce:transition-none">
          <span className="flex size-19 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--green),var(--label)_25%)] text-white dark:bg-[color-mix(in_oklab,var(--green),black_35%)]">
            <CheckIcon weight="bold" className="size-9.5" />
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">
            Welcome to suiss Music.
          </h1>
          <p className="text-lg text-label-secondary">
            Your one-month free trial has started.
          </p>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="rounded-xs text-lg text-link outline-none hover:underline focus-visible:focus-ring"
          >
            Start over ›
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="grid min-h-140 md:grid-cols-2">
      <div
        style={{ backgroundImage: `url(${image})` }}
        className="relative flex min-h-80 flex-col justify-end overflow-hidden bg-black bg-cover bg-center"
      >
        <div className="bg-linear-to-b from-transparent to-black/80 p-6 pt-28 text-white md:p-10 md:pt-40">
          <p className="flex items-center gap-1.5 text-2xl font-semibold">
            <MusicNotesIcon weight="fill" className="size-6.5" />
            suiss Music
          </p>
          <p className="mt-2.5 text-3xl leading-tight font-semibold tracking-tight">
            Over 100 million songs. Ad-free.
          </p>
          <p className="mt-2 text-base text-white/80">
            1 month free, then $10.99/month.
          </p>
        </div>
      </div>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          if (valid) setDone(true)
        }}
        className="flex flex-col justify-center gap-4 px-6 py-10 md:px-12"
      >
        <h1 className="text-4xl font-semibold tracking-tight text-balance">
          Start your free trial.
        </h1>
        <div className="overflow-hidden rounded-xl border border-separator-strong bg-surface has-focus-visible:focus-ring *:not-first:border-t *:not-first:border-t-separator-strong">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="suiss Account email"
            aria-label="suiss Account email"
            autoComplete="email"
            className="h-13 rounded-none bg-transparent px-4 text-lg [--focus-ring-width:0px]"
          />
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            aria-label="Create a password"
            autoComplete="new-password"
            className="h-13 rounded-none bg-transparent px-4 text-lg [--focus-ring-width:0px]"
          />
        </div>
        {password && (
          <div
            role="meter"
            aria-label="Password strength"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={score}
            aria-valuetext={strengthLabel[score]}
            className="grid grid-cols-4 gap-1 transition-[opacity,translate] duration-800 starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none"
          >
            {[0, 1, 2, 3].map((bar) => (
              <span
                key={bar}
                className={`h-1 rounded-full transition-colors duration-300 ${bar < Math.max(1, score) ? levels[score] : "bg-control"}`}
              />
            ))}
          </div>
        )}
        <Label className="cursor-pointer items-start gap-2.5 text-sm leading-normal text-label-secondary">
          <Checkbox
            checked={terms}
            onCheckedChange={setTerms}
            className="mt-0.5"
          />
          I have read and agree to the suiss Media Services Terms and
          Conditions.
        </Label>
        <Button type="submit" size="lg" block disabled={!valid}>
          Start free trial
        </Button>
        <p className="flex flex-wrap justify-center gap-x-1 text-sm text-label-secondary">
          <span>Already have an account?</span>
          <a href="#sign-in" className="text-link hover:underline">
            Sign in ›
          </a>
        </p>
      </form>
    </section>
  )
}
