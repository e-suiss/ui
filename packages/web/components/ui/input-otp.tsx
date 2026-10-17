"use client"

import { OTPInput, OTPInputContext } from "input-otp"
import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/lib/utils"

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
      containerClassName={cn("flex items-center", containerClassName)}
      spellCheck={false}
      className={cn(
        "cn-input-otp-input disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("cn-input-otp-group flex items-center", className)}
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
        "cn-input-otp-slot relative flex items-center justify-center data-[active=true]:z-10",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-0.5 animate-caret-blink rounded-full bg-primary duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="cn-input-otp-separator flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <IconPlaceholder
        lucide="MinusIcon"
        tabler="IconMinus"
        hugeicons="MinusSignIcon"
        phosphor="MinusIcon"
        remixicon="RiSubtractLine"
      />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
