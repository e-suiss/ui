"use client"

import { MinusIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import { OTPInput, OTPInputContext } from "input-otp"
import * as React from "react"

function InputOTP({
  className,
  containerClassName,
  value,
  defaultValue,
  onChange,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue === undefined ? "" : String(defaultValue)
  )

  return (
    <OTPInput
      data-slot="input-otp"
      value={value ?? uncontrolledValue}
      onChange={(next: string) => {
        if (value === undefined) setUncontrolledValue(next)
        onChange?.(next)
      }}
      containerClassName={cn(
        "cn-input-otp flex items-center",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-13 w-11 items-center justify-center rounded-lg border-[1.5px] border-transparent bg-control text-xl font-semibold tabular-nums transition-colors outline-none aria-invalid:border-danger aria-invalid:bg-danger/5 dark:aria-invalid:bg-danger/10 in-[.cn-input-otp:has(input[aria-invalid=true])]:border-danger in-[.cn-input-otp:has(input[aria-invalid=true])]:bg-danger/5 dark:in-[.cn-input-otp:has(input[aria-invalid=true])]:bg-danger/10 in-[.cn-input-otp:has(input:disabled)]:bg-control-disabled in-[.cn-input-otp:has(input:disabled)]:text-label-quaternary data-[active=true]:z-10 data-[active=true]:border-accent",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-0.5 animate-caret-blink rounded-full bg-accent duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center in-[.cn-input-otp:has(input:disabled)]:text-label-quaternary [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
