import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  OtpAutofill,
  OtpAutofillInput,
  OtpAutofillSuggestion,
  useOtpAutofill,
} from "@/components/interactions/otp-autofill"
import { InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const SUGGESTION = /From Messages/
const SUGGESTION_WITH_CODE = /From Messages\s*482913/

function State() {
  const { state, value } = useOtpAutofill()
  return (
    <p data-testid="state">
      {state}:{value}
    </p>
  )
}

function Verification({
  onVerify,
  code = "482913",
  webOtp = false,
  maxLength = 6,
  source,
}: {
  onVerify: (code: string) => Promise<boolean> | boolean
  code?: string | null
  webOtp?: boolean
  maxLength?: number
  source?: string
}) {
  return (
    <OtpAutofill maxLength={maxLength} onVerify={onVerify} webOtp={webOtp}>
      <OtpAutofillInput aria-label="Verification code">
        <InputOTPGroup>
          {Array.from({ length: maxLength }, (_, index) => index).map(
            (index) => (
              <InputOTPSlot key={`slot-${index + 1}`} index={index} />
            )
          )}
        </InputOTPGroup>
      </OtpAutofillInput>
      <State />
      <OtpAutofillSuggestion code={code} {...(source ? { source } : {})} />
      <button type="button">Elsewhere</button>
    </OtpAutofill>
  )
}

function element(slot: string) {
  const node = document.querySelector<HTMLElement>(`[data-slot=${slot}]`)
  if (!node) throw new Error(`${slot} not rendered`)
  return node
}

const root = () => element("otp-autofill")
const state = () => root().dataset.state
const input = () => page.getByRole("textbox", { name: "Verification code" })
const inputElement = () => input().element() as HTMLInputElement
const slots = () =>
  Array.from(
    document.querySelectorAll("[data-slot=input-otp-slot]"),
    (slot) => slot.textContent ?? ""
  ).join("")
const suggestion = () => element("otp-autofill-suggestion")
const suggestionOpen = () => suggestion().dataset.closed === undefined
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function deferred() {
  let resolve: (value: boolean) => void = () => undefined
  const promise = new Promise<boolean>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

afterEach(async () => {
  await page.viewport(1280, 800)
  Reflect.deleteProperty(window, "OTPCredential")
  vi.restoreAllMocks()
})

describe("OtpAutofill", () => {
  it("offers the incoming code only while the empty field is focused", async () => {
    await render(<Verification onVerify={() => true} />)
    expect(state()).toBe("idle")
    expect(suggestionOpen()).toBe(false)
    expect(suggestion().inert).toBe(true)
    inputElement().focus()
    await expect.poll(suggestionOpen).toBe(true)
    expect(suggestion().inert).toBe(false)
    expect(suggestion().dataset.placement).toBe("inline")
    await expect
      .element(page.getByRole("button", { name: SUGGESTION_WITH_CODE }))
      .toBeVisible()
    inputElement().blur()
    await expect.poll(suggestionOpen).toBe(false)
  })

  it("hides the suggestion without a code or once typing starts", async () => {
    const { rerender } = await render(
      <Verification onVerify={() => true} code={null} />
    )
    inputElement().focus()
    await wait(50)
    expect(suggestionOpen()).toBe(false)
    await rerender(<Verification onVerify={() => true} code="482913" />)
    await expect.poll(suggestionOpen).toBe(true)
    await userEvent.keyboard("4")
    await expect.poll(suggestionOpen).toBe(false)
  })

  it("uses a custom source label", async () => {
    await render(<Verification onVerify={() => true} source="From Mail" />)
    expect(suggestion().textContent).toContain("From Mail")
  })

  it("fills the code digit by digit, verifies and locks on success", async () => {
    const pending = deferred()
    const onVerify = vi.fn(() => pending.promise)
    await render(<Verification onVerify={onVerify} />)
    inputElement().focus()
    await expect.poll(suggestionOpen).toBe(true)
    const startedAt = performance.now()
    suggestion().click()
    await expect.poll(state).toBe("filling")
    expect(inputElement().readOnly).toBe(true)
    await expect.poll(slots).toBe("48")
    expect(onVerify).not.toHaveBeenCalled()
    await expect.poll(state, { timeout: 2000 }).toBe("verifying")
    expect(performance.now() - startedAt).toBeGreaterThanOrEqual(6 * 60)
    expect(slots()).toBe("482913")
    expect(onVerify).toHaveBeenCalledExactlyOnceWith("482913")
    expect(inputElement().readOnly).toBe(true)
    expect(suggestionOpen()).toBe(false)
    pending.resolve(true)
    await expect.poll(state).toBe("verified")
    expect(inputElement().readOnly).toBe(true)
    await userEvent.keyboard("{Backspace}")
    await wait(50)
    expect(slots()).toBe("482913")
  })

  it("keeps the field focused when the suggestion is pressed", async () => {
    await render(<Verification onVerify={() => true} />)
    inputElement().focus()
    await expect.poll(suggestionOpen).toBe(true)
    await page.getByRole("button", { name: SUGGESTION }).click()
    expect(document.activeElement).toBe(inputElement())
    await expect.poll(state, { timeout: 2000 }).toBe("verified")
  })

  it("shakes, clears and refocuses after a wrong code", async () => {
    const onVerify = vi.fn(() => false)
    await render(<Verification onVerify={onVerify} code="113355" />)
    inputElement().focus()
    await expect.poll(suggestionOpen).toBe(true)
    suggestion().click()
    await expect.poll(state, { timeout: 2000 }).toBe("invalid")
    expect(inputElement().getAttribute("aria-invalid")).toBe("true")
    expect(slots()).toBe("113355")
    expect(inputElement().readOnly).toBe(false)
    const container = root().querySelector<HTMLElement>(
      "[data-input-otp-container]"
    )
    expect(container?.getAnimations().length).toBeGreaterThan(0)
    inputElement().blur()
    await wait(300)
    expect(state()).toBe("invalid")
    await expect.poll(state, { timeout: 2000 }).toBe("idle")
    expect(slots()).toBe("")
    expect(inputElement().hasAttribute("aria-invalid")).toBe(false)
    expect(document.activeElement).toBe(inputElement())
    await expect.poll(suggestionOpen).toBe(true)
  })

  it("verifies a code typed by hand once it is complete", async () => {
    const onVerify = vi.fn(() => true)
    await render(<Verification onVerify={onVerify} code={null} />)
    await input().click()
    await userEvent.keyboard("48291")
    await expect.poll(slots).toBe("48291")
    expect(state()).toBe("idle")
    expect(onVerify).not.toHaveBeenCalled()
    await userEvent.keyboard("3")
    await expect.poll(state).toBe("verified")
    expect(onVerify).toHaveBeenCalledExactlyOnceWith("482913")
  })

  it("animates a pasted code like an autofill", async () => {
    const onVerify = vi.fn(() => true)
    await render(<Verification onVerify={onVerify} code={null} />)
    await input().fill("482913")
    await expect.poll(state).toBe("filling")
    await expect.poll(state, { timeout: 2000 }).toBe("verified")
    expect(onVerify).toHaveBeenCalledExactlyOnceWith("482913")
  })

  it("lets typing take over during the wrong code pause", async () => {
    const onVerify = vi.fn(() => false)
    await render(<Verification onVerify={onVerify} code={null} />)
    await input().click()
    await userEvent.keyboard("111111")
    await expect.poll(state).toBe("invalid")
    await userEvent.keyboard("{Backspace}")
    await expect.poll(state).toBe("idle")
    expect(slots()).toBe("11111")
    await wait(800)
    expect(slots()).toBe("11111")
    expect(state()).toBe("idle")
  })

  it("ignores a stale verification result after the code changed", async () => {
    const first = deferred()
    const onVerify = vi.fn(() => first.promise)
    await render(<Verification onVerify={onVerify} code={null} maxLength={2} />)
    await input().click()
    await userEvent.keyboard("12")
    await expect.poll(state).toBe("verifying")
    expect(inputElement().readOnly).toBe(true)
    await userEvent.keyboard("{Backspace}")
    await wait(50)
    expect(slots()).toBe("12")
    first.resolve(true)
    await expect.poll(state).toBe("verified")
  })

  it("strips spaces and stops at the maximum length", async () => {
    const onVerify = vi.fn(() => true)
    await render(<Verification onVerify={onVerify} code="48 29 13 77" />)
    inputElement().focus()
    await expect.poll(suggestionOpen).toBe(true)
    suggestion().click()
    await expect.poll(state, { timeout: 2000 }).toBe("verified")
    expect(onVerify).toHaveBeenCalledExactlyOnceWith("482913")
  })

  it("fills a short code without verifying it", async () => {
    const onVerify = vi.fn(() => true)
    await render(<Verification onVerify={onVerify} code="482" />)
    inputElement().focus()
    await expect.poll(suggestionOpen).toBe(true)
    suggestion().click()
    await expect.poll(slots, { timeout: 2000 }).toBe("482")
    await expect.poll(state).toBe("idle")
    expect(onVerify).not.toHaveBeenCalled()
  })

  it("does nothing for a blank code", async () => {
    await render(<Verification onVerify={() => true} code="   " />)
    inputElement().focus()
    await expect.poll(suggestionOpen).toBe(true)
    suggestion().click()
    await wait(100)
    expect(state()).toBe("idle")
    expect(slots()).toBe("")
  })

  it("reads the code from WebOTP when the browser supports it", async () => {
    Object.defineProperty(window, "OTPCredential", {
      configurable: true,
      value: class {},
    })
    let signal: AbortSignal | undefined
    const get = vi
      .spyOn(navigator.credentials, "get")
      .mockImplementation((options) => {
        signal = options?.signal ?? undefined
        return Promise.resolve({
          code: "246810",
          id: "",
          type: "otp",
        } as Credential)
      })
    const onVerify = vi.fn(() => true)
    const screen = await render(
      <Verification onVerify={onVerify} code={null} webOtp />
    )
    expect(get).toHaveBeenCalledOnce()
    expect(get.mock.calls[0]?.[0]).toMatchObject({
      otp: { transport: ["sms"] },
    })
    await expect.poll(state, { timeout: 2000 }).toBe("verified")
    expect(onVerify).toHaveBeenCalledExactlyOnceWith("246810")
    expect(signal?.aborted).toBe(false)
    await screen.unmount()
    expect(signal?.aborted).toBe(true)
  })

  it("ignores WebOTP when disabled, unsupported or rejected", async () => {
    const get = vi
      .spyOn(navigator.credentials, "get")
      .mockRejectedValue(new Error("aborted"))
    await render(<Verification onVerify={() => true} webOtp />)
    expect(get).not.toHaveBeenCalled()
    Object.defineProperty(window, "OTPCredential", {
      configurable: true,
      value: class {},
    })
    const off = await render(
      <Verification onVerify={() => true} webOtp={false} />
    )
    expect(get).not.toHaveBeenCalled()
    await off.unmount()
    await render(<Verification onVerify={() => true} webOtp />)
    expect(get).toHaveBeenCalledOnce()
    await wait(50)
    expect(state()).toBe("idle")
  })

  it("docks the suggestion above the keyboard on small screens", async () => {
    await page.viewport(390, 700)
    await render(<Verification onVerify={() => true} />)
    await expect.poll(() => suggestion().dataset.placement).toBe("keyboard")
    expect(getComputedStyle(suggestion()).position).toBe("fixed")
    expect(suggestion().style.bottom).toBe("0px")
    inputElement().focus()
    await expect.poll(suggestionOpen).toBe(true)
    expect(suggestion().textContent).toBe("From Messages482913")
  })

  it("passes focus and blur through to the caller", async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    await render(
      <OtpAutofill maxLength={4} onVerify={() => true}>
        <OtpAutofillInput
          aria-label="Verification code"
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
          </InputOTPGroup>
        </OtpAutofillInput>
      </OtpAutofill>
    )
    inputElement().focus()
    inputElement().blur()
    expect(onFocus).toHaveBeenCalledOnce()
    expect(onBlur).toHaveBeenCalledOnce()
  })

  it("throws when its parts are used outside the provider", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    await expect(render(<State />)).rejects.toThrow(
      "useOtpAutofill must be used within an <OtpAutofill />"
    )
    error.mockRestore()
  })
})
