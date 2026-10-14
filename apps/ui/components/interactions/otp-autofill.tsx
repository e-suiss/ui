"use client"

import { ChatCircleTextIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"

import { InputOTP } from "@/components/ui/input-otp"
import { useIsMobile } from "@/hooks/use-mobile"

type OtpAutofillState =
  | "idle"
  | "filling"
  | "verifying"
  | "verified"
  | "invalid"

type OtpAutofillContextProps = {
  state: OtpAutofillState
  value: string
  focused: boolean
  maxLength: number
  inputRef: React.RefObject<HTMLInputElement | null>
  fill: (code: string) => void
  type: (value: string) => void
  setFocused: (focused: boolean) => void
}

const OtpAutofillContext = React.createContext<OtpAutofillContextProps | null>(
  null
)

function useOtpAutofill() {
  const context = React.useContext(OtpAutofillContext)

  if (!context) {
    throw new Error("useOtpAutofill must be used within an <OtpAutofill />")
  }

  return context
}

const FILL_INTERVAL = 70
const INVALID_HOLD = 600

type OTPCredentialLike = Credential & { code: string }

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function fieldsOf(root: HTMLElement | null) {
  return root?.querySelector<HTMLElement>("[data-input-otp-container]") ?? null
}

function reducesMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function pop(container: HTMLElement | null, index: number) {
  if (reducesMotion()) return
  const slot = container?.querySelectorAll<HTMLElement>(
    "[data-slot=input-otp-slot]"
  )[index]
  slot?.animate([{ scale: 0.8 }, { scale: 1.08, offset: 0.6 }, { scale: 1 }], {
    duration: 240,
    easing: "cubic-bezier(0.32, 0.72, 0, 1)",
  })
}

function shake(container: HTMLElement | null) {
  if (reducesMotion()) return
  container?.animate(
    [
      { translate: "0" },
      { translate: "-8px" },
      { translate: "7px" },
      { translate: "-5px" },
      { translate: "3px" },
      { translate: "0" },
    ],
    { duration: 400, easing: "ease-out" }
  )
}

function OtpAutofill({
  maxLength,
  onVerify,
  webOtp = true,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  maxLength: number
  onVerify: (code: string) => Promise<boolean> | boolean
  webOtp?: boolean
}) {
  const [value, setValue] = React.useState("")
  const [state, setState] = React.useState<OtpAutofillState>("idle")
  const [focused, setFocused] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const runRef = React.useRef(0)
  const onVerifyRef = React.useRef(onVerify)

  React.useEffect(() => {
    onVerifyRef.current = onVerify
  }, [onVerify])

  const verify = React.useCallback(async (code: string, run: number) => {
    setState("verifying")
    const valid = await onVerifyRef.current(code)
    if (run !== runRef.current) return
    if (valid) {
      setState("verified")
      return
    }
    setState("invalid")
    shake(fieldsOf(rootRef.current))
    await wait(INVALID_HOLD)
    if (run !== runRef.current) return
    setValue("")
    setState("idle")
    inputRef.current?.focus()
  }, [])

  const fill = React.useCallback(
    async (code: string) => {
      const digits = code.replace(/\s/g, "").slice(0, maxLength)
      if (!digits) return
      runRef.current += 1
      const run = runRef.current
      setState("filling")
      for (let index = 1; index <= digits.length; index += 1) {
        setValue(digits.slice(0, index))
        pop(fieldsOf(rootRef.current), index - 1)
        await wait(FILL_INTERVAL)
        if (run !== runRef.current) return
      }
      if (digits.length === maxLength) verify(digits, run)
      else setState("idle")
    },
    [maxLength, verify]
  )

  const type = (next: string) => {
    if (next.length - value.length > 1) {
      fill(next)
      return
    }
    runRef.current += 1
    setState("idle")
    setValue(next)
    if (next.length === maxLength) verify(next, runRef.current)
  }

  React.useEffect(() => {
    if (!webOtp || !("OTPCredential" in window)) return
    const controller = new AbortController()
    navigator.credentials
      .get({
        otp: { transport: ["sms"] },
        signal: controller.signal,
      } as CredentialRequestOptions)
      .then((credential) => {
        const code = (credential as OTPCredentialLike | null)?.code
        if (code) fill(code)
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [webOtp, fill])

  return (
    <OtpAutofillContext.Provider
      value={{
        state,
        value,
        focused,
        maxLength,
        inputRef,
        fill,
        type,
        setFocused,
      }}
    >
      <div
        ref={rootRef}
        data-slot="otp-autofill"
        data-state={state}
        className={cn(
          "group/otp-autofill flex flex-col items-center gap-4",
          className
        )}
        {...props}
      />
    </OtpAutofillContext.Provider>
  )
}

function OtpAutofillInput({
  containerClassName,
  onFocus,
  onBlur,
  children,
  ...props
}: Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "maxLength" | "children"
> & {
  containerClassName?: string
  children: React.ReactNode
}) {
  const { state, value, maxLength, inputRef, type, setFocused } =
    useOtpAutofill()
  const locked =
    state === "filling" || state === "verifying" || state === "verified"

  return (
    <InputOTP
      ref={inputRef}
      data-slot="otp-autofill-input"
      maxLength={maxLength}
      value={value}
      readOnly={locked}
      aria-invalid={state === "invalid" || undefined}
      onChange={(next) => {
        if (!locked) type(next)
      }}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      containerClassName={cn(
        "[&_[data-slot=input-otp-slot]]:transition-[background-color,border-color,color,opacity] [&_[data-slot=input-otp-slot]]:duration-300 group-data-[state=invalid]/otp-autofill:[&_[data-slot=input-otp-slot]]:border-danger group-data-[state=invalid]/otp-autofill:[&_[data-slot=input-otp-slot]]:text-danger group-data-[state=verified]/otp-autofill:[&_[data-slot=input-otp-slot]]:border-success group-data-[state=verified]/otp-autofill:[&_[data-slot=input-otp-slot]]:bg-success-surface group-data-[state=verified]/otp-autofill:[&_[data-slot=input-otp-slot]]:text-success group-data-[state=verifying]/otp-autofill:[&_[data-slot=input-otp-slot]]:opacity-60",
        containerClassName
      )}
      {...props}
    >
      {children}
    </InputOTP>
  )
}

function OtpAutofillSuggestion({
  code,
  source = "From Messages",
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  code: string | null | undefined
  source?: React.ReactNode
}) {
  const { state, value, focused, fill } = useOtpAutofill()
  const isMobile = useIsMobile()
  const [keyboardInset, setKeyboardInset] = React.useState(0)
  const open = Boolean(code) && focused && value === "" && state === "idle"

  React.useEffect(() => {
    const viewport = window.visualViewport
    if (!isMobile || !viewport) return
    const update = () =>
      setKeyboardInset(
        Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
      )
    update()
    viewport.addEventListener("resize", update)
    viewport.addEventListener("scroll", update)
    return () => {
      viewport.removeEventListener("resize", update)
      viewport.removeEventListener("scroll", update)
    }
  }, [isMobile])

  return (
    <button
      type="button"
      data-slot="otp-autofill-suggestion"
      data-closed={open ? undefined : ""}
      data-placement={isMobile ? "keyboard" : "inline"}
      inert={!open}
      style={isMobile ? { bottom: keyboardInset } : undefined}
      onPointerDown={(event) => event.preventDefault()}
      onClick={() => code && fill(code)}
      className={cn(
        "flex items-center outline-none transition-[opacity,translate,visibility] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] transition-discrete select-none focus-visible:focus-ring data-closed:invisible data-closed:opacity-0",
        "data-[placement=inline]:gap-2.5 data-[placement=inline]:rounded-full data-[placement=inline]:bg-surface-raised data-[placement=inline]:py-2 data-[placement=inline]:ps-3 data-[placement=inline]:pe-4 data-[placement=inline]:text-sm data-[placement=inline]:shadow-lg data-[placement=inline]:ring-1 data-[placement=inline]:ring-separator data-[placement=inline]:hover:bg-item-hover motion-safe:data-[placement=inline]:data-closed:-translate-y-1",
        "data-[placement=keyboard]:fixed data-[placement=keyboard]:inset-x-0 data-[placement=keyboard]:z-50 data-[placement=keyboard]:min-h-11 data-[placement=keyboard]:flex-col data-[placement=keyboard]:justify-center data-[placement=keyboard]:border-t data-[placement=keyboard]:border-separator data-[placement=keyboard]:bg-surface-secondary/85 data-[placement=keyboard]:pt-1.5 data-[placement=keyboard]:pb-[max(0.375rem,env(safe-area-inset-bottom))] data-[placement=keyboard]:backdrop-blur-xl data-[placement=keyboard]:active:bg-item-pressed motion-safe:data-[placement=keyboard]:data-closed:translate-y-2",
        className
      )}
      {...props}
    >
      {isMobile ? (
        <>
          <span className="text-xs text-label-secondary">{source}</span>
          <span className="text-base font-semibold tracking-wider tabular-nums">
            {code}
          </span>
        </>
      ) : (
        <>
          <ChatCircleTextIcon
            aria-hidden
            weight="fill"
            className="size-5 shrink-0 text-success"
          />
          <span className="text-label-secondary">{source}</span>
          <span className="font-semibold tracking-wider tabular-nums">
            {code}
          </span>
        </>
      )}
    </button>
  )
}

export { OtpAutofill, OtpAutofillInput, OtpAutofillSuggestion, useOtpAutofill }
