"use client"

import { CheckIcon } from "@phosphor-icons/react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

const EMAIL = /.+@.+\..+/
const UPPERCASE = /[A-Z]/
const LOWERCASE = /[a-z]/
const DIGIT = /\d/
const SYMBOL = /[^A-Za-z0-9]/

const stackClass =
  "overflow-hidden rounded-xl border border-separator-strong bg-surface transition-[border-color,background-color] duration-200 has-focus-visible:focus-ring data-invalid:border-danger data-invalid:bg-danger/5 dark:data-invalid:bg-danger/10 *:not-first:border-t *:not-first:border-t-separator-strong"

const inputClass =
  "h-13 rounded-none bg-transparent px-4 text-lg [--focus-ring-width:0px] aria-invalid:border-x-transparent aria-invalid:border-b-transparent aria-invalid:bg-transparent dark:aria-invalid:bg-transparent"

const rules = [
  {
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "Upper and lowercase letters",
    test: (value: string) => UPPERCASE.test(value) && LOWERCASE.test(value),
  },
  { label: "At least one number", test: (value: string) => DIGIT.test(value) },
]

const strength = (value: string) =>
  rules.filter((rule) => rule.test(value)).length + (SYMBOL.test(value) ? 1 : 0)

function PasswordRules({ password }: { password: string }) {
  return (
    <ul className="flex flex-col gap-1.5 text-start">
      {rules.map((rule) => {
        const met = rule.test(password)
        return (
          <li
            key={rule.label}
            data-met={met ? "" : undefined}
            className="group/rule flex items-center gap-2 text-sm text-label-secondary data-met:text-label"
          >
            <span className="flex size-4 items-center justify-center rounded-full border-[1.5px] border-label-quaternary text-white transition-[background-color,border-color] duration-250 group-data-met/rule:border-transparent group-data-met/rule:bg-[color-mix(in_oklab,var(--green),var(--label)_25%)] dark:group-data-met/rule:bg-[color-mix(in_oklab,var(--green),black_35%)]">
              <CheckIcon
                weight="bold"
                className="size-2.5 scale-0 transition-[scale] duration-250 ease-[cubic-bezier(0.3,1.25,0.5,1)] group-data-met/rule:scale-100 motion-reduce:transition-none"
              />
            </span>
            {rule.label}
            <span className="sr-only">{met ? "(met)" : "(not met)"}</span>
          </li>
        )
      })}
    </ul>
  )
}

export function SignupForm() {
  const [form, setForm] = React.useState({
    first: "",
    last: "",
    country: "United States",
    birthday: "",
    email: "",
    password: "",
    confirm: "",
  })
  const [tried, setTried] = React.useState(false)
  const [done, setDone] = React.useState(false)

  const update =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }))

  const mismatch = tried && !!form.confirm && form.password !== form.confirm
  const valid =
    !!form.first &&
    !!form.last &&
    !!form.birthday &&
    EMAIL.test(form.email) &&
    strength(form.password) >= 3 &&
    form.password === form.confirm

  if (done) {
    return (
      <section className="flex min-h-215 items-center justify-center p-6">
        <div className="flex max-w-105 flex-col items-center gap-3.5 text-center transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-4.5 starting:opacity-0 motion-reduce:transition-none">
          <span className="flex size-19 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--green),var(--label)_25%)] text-white dark:bg-[color-mix(in_oklab,var(--green),black_35%)]">
            <CheckIcon weight="bold" className="size-9.5" />
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">
            Your suiss Account is ready.
          </h1>
          <p className="text-lg text-label-secondary">
            We sent a verification code to {form.email}.
          </p>
          <button
            type="button"
            onClick={() => {
              setDone(false)
              setTried(false)
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
    <section className="px-6 py-9">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          setTried(true)
          if (valid) setDone(true)
        }}
        className="mx-auto flex w-115 max-w-full flex-col text-center"
      >
        <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Create your suiss Account
        </h1>
        <p className="mt-2.5 text-lg text-balance text-label-secondary">
          One suiss Account is all you need to access every suiss service.{" "}
          <a
            href="#learn"
            className="text-link underline decoration-1 underline-offset-3"
          >
            Learn more ›
          </a>
        </p>
        <fieldset className="mt-5.5 flex flex-col gap-2 text-start">
          <legend className="mb-2 text-sm font-semibold">Your name</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className={stackClass}>
              <Input
                value={form.first}
                onChange={update("first")}
                placeholder="First name"
                aria-label="First name"
                autoComplete="given-name"
                className={inputClass}
              />
            </div>
            <div className={stackClass}>
              <Input
                value={form.last}
                onChange={update("last")}
                placeholder="Last name"
                aria-label="Last name"
                autoComplete="family-name"
                className={inputClass}
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="mt-5.5 flex flex-col text-start">
          <legend className="mb-2 text-sm font-semibold">
            Country or region and birthday
          </legend>
          <div className={stackClass}>
            <NativeSelect
              value={form.country}
              onChange={update("country")}
              aria-label="Country or region"
              className="w-full [&_select]:h-13 [&_select]:rounded-none [&_select]:bg-transparent [&_select]:ps-4 [&_select]:text-lg [&_select]:[--focus-ring-width:0px]"
            >
              {[
                "United States",
                "Germany",
                "Netherlands",
                "United Kingdom",
              ].map((country) => (
                <NativeSelectOption key={country} value={country}>
                  {country}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <Input
              value={form.birthday}
              onChange={update("birthday")}
              placeholder="Birthday (MM/DD/YYYY)"
              aria-label="Birthday"
              autoComplete="bday"
              inputMode="numeric"
              className={inputClass}
            />
          </div>
        </fieldset>
        <fieldset className="mt-5.5 flex flex-col text-start">
          <legend className="mb-2 text-sm font-semibold">suiss Account</legend>
          <div className={stackClass}>
            <Input
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="name@example.com"
              aria-label="Email"
              aria-describedby="signup-form-email-hint"
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <p
            id="signup-form-email-hint"
            className="mt-1.5 text-xs text-label-secondary"
          >
            This will be your new suiss Account.
          </p>
        </fieldset>
        <fieldset className="mt-5.5 flex flex-col text-start">
          <legend className="mb-2 text-sm font-semibold">Password</legend>
          <div data-invalid={mismatch ? "" : undefined} className={stackClass}>
            <Input
              type="password"
              value={form.password}
              onChange={update("password")}
              placeholder="Password"
              aria-label="Password"
              autoComplete="new-password"
              className={inputClass}
            />
            <Input
              type="password"
              value={form.confirm}
              onChange={update("confirm")}
              placeholder="Confirm password"
              aria-label="Confirm password"
              aria-invalid={mismatch || undefined}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <div
            data-open={form.password ? "" : undefined}
            className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] data-open:grid-rows-[1fr] motion-reduce:transition-none"
          >
            <div className="min-h-0 overflow-hidden">
              <div className="px-1 pt-3.5">
                <PasswordRules password={form.password} />
              </div>
            </div>
          </div>
        </fieldset>
        <p aria-live="polite" className="mt-3.5 min-h-5 text-sm text-danger">
          {tried && !valid ? "Please fill in every field correctly." : ""}
        </p>
        <Button type="submit" size="lg" className="mt-3 min-w-40 self-center">
          Continue
        </Button>
      </form>
    </section>
  )
}
