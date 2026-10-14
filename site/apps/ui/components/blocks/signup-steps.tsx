"use client"

import { CheckIcon } from "@phosphor-icons/react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const EMAIL = /.+@.+\..+/
const UPPERCASE = /[A-Z]/
const LOWERCASE = /[a-z]/
const DIGIT = /\d/

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

const steps = [
  {
    key: "name",
    title: "What should we call you?",
    description: "Your name appears across suiss products and services.",
    placeholder: "Full name",
    type: "text",
    autoComplete: "name",
    valid: (value: string) => value.trim().length > 1,
  },
  {
    key: "email",
    title: "What's your email address?",
    description: "This will be your suiss Account.",
    placeholder: "name@example.com",
    type: "email",
    autoComplete: "email",
    valid: (value: string) => EMAIL.test(value),
  },
  {
    key: "password",
    title: "Create a password.",
    description: "A strong password keeps your account safe.",
    placeholder: "Password",
    type: "password",
    autoComplete: "new-password",
    valid: (value: string) =>
      rules.filter((rule) => rule.test(value)).length >= 3,
  },
] as const

type Values = Record<(typeof steps)[number]["key"], string>

export function SignupSteps() {
  const [index, setIndex] = React.useState(0)
  const [direction, setDirection] = React.useState(1)
  const [values, setValues] = React.useState<Values>({
    name: "",
    email: "",
    password: "",
  })
  const [done, setDone] = React.useState(false)
  const step = steps[index] ?? steps[0]
  const value = values[step.key]
  const ready = step.valid(value)

  const go = (delta: number) => {
    setDirection(delta)
    if (index + delta > steps.length - 1) return setDone(true)
    setIndex(Math.max(0, index + delta))
  }

  if (done) {
    return (
      <section className="flex min-h-140 items-center justify-center p-6">
        <div className="flex max-w-105 flex-col items-center gap-3.5 text-center transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-4.5 starting:opacity-0 motion-reduce:transition-none">
          <span className="flex size-19 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--green),var(--label)_25%)] text-white dark:bg-[color-mix(in_oklab,var(--green),black_35%)]">
            <CheckIcon weight="bold" className="size-9.5" />
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">
            Welcome, {values.name.split(" ")[0]}.
          </h1>
          <p className="text-lg text-label-secondary">
            Your account is ready. Verify {values.email} to finish.
          </p>
          <button
            type="button"
            onClick={() => {
              setDone(false)
              setIndex(0)
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
    <section className="flex min-h-140 flex-col items-center px-6 py-9">
      <ol aria-label="Progress" className="flex gap-2">
        {steps.map((item, position) => (
          <li
            key={item.key}
            aria-current={position === index ? "step" : undefined}
            data-reached={position <= index ? "" : undefined}
            className="h-1.5 w-1.5 rounded-full bg-control transition-[width,background-color] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] data-reached:bg-accent aria-[current=step]:w-7 motion-reduce:transition-none"
          >
            <span className="sr-only">
              Step {position + 1}
              {position < index ? ", complete" : ""}
            </span>
          </li>
        ))}
      </ol>
      <div className="flex w-115 max-w-full flex-1 flex-col justify-center py-8">
        <form
          key={step.key}
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            if (ready) go(1)
          }}
          style={{ "--from": `${direction * 40}px` } as React.CSSProperties}
          className="flex flex-col gap-3.5 text-center transition-[opacity,translate] duration-[450ms,550ms] ease-[ease,cubic-bezier(0.32,0.72,0,1)] starting:translate-x-(--from) starting:opacity-0 motion-reduce:transition-none"
        >
          <p className="text-sm font-semibold text-label-secondary">
            Step {index + 1} of {steps.length}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            {step.title}
          </h1>
          <p className="text-lg text-label-secondary">{step.description}</p>
          <div className="mt-4 overflow-hidden rounded-xl border border-separator-strong bg-surface has-focus-visible:focus-ring">
            <Input
              autoFocus={index > 0}
              type={step.type}
              value={value}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [step.key]: event.target.value,
                }))
              }
              placeholder={step.placeholder}
              aria-label={step.placeholder}
              autoComplete={step.autoComplete}
              className="h-13 rounded-none bg-transparent px-4 text-lg [--focus-ring-width:0px]"
            />
          </div>
          {step.key === "password" && value && (
            <ul className="flex flex-col gap-1.5 text-start">
              {rules.map((rule) => {
                const met = rule.test(value)
                return (
                  <li
                    key={rule.label}
                    data-met={met ? "" : undefined}
                    className="group/rule flex items-center gap-2 text-sm text-label-secondary data-met:text-label"
                  >
                    <span className="flex size-4 items-center justify-center rounded-full border-[1.5px] border-label-quaternary text-white transition-[background-color,border-color] duration-250 group-data-met/rule:border-transparent group-data-met/rule:bg-[color-mix(in_oklab,var(--green),var(--label)_25%)] dark:group-data-met/rule:bg-[color-mix(in_oklab,var(--green),black_35%)]">
                      <CheckIcon
                        weight="bold"
                        className="size-2.5 scale-0 transition-[scale] duration-250 group-data-met/rule:scale-100 motion-reduce:transition-none"
                      />
                    </span>
                    {rule.label}
                    <span className="sr-only">
                      {met ? "(met)" : "(not met)"}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </form>
      </div>
      <div className="flex justify-center gap-4">
        {index > 0 && (
          <Button size="lg" variant="outline" onClick={() => go(-1)}>
            Back
          </Button>
        )}
        <Button
          size="lg"
          disabled={!ready}
          onClick={() => go(1)}
          className="min-w-35"
        >
          {index === steps.length - 1 ? "Create account" : "Continue"}
        </Button>
      </div>
    </section>
  )
}
