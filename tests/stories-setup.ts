import { afterEach, beforeEach, expect, type MockInstance, vi } from "vitest"

const RESIZE_LOOP =
  "ResizeObserver loop completed with undelivered notifications"

let errors: string[] = []
let consoleError: MockInstance | undefined

beforeEach(() => {
  errors = []
  consoleError = vi
    .spyOn(console, "error")
    .mockImplementation((...args: unknown[]) => {
      const message = args.map(String).join(" ")
      if (!message.includes(RESIZE_LOOP)) errors.push(message)
    })
})

afterEach(() => {
  consoleError?.mockRestore()
  expect(errors, "console.error was called while rendering").toEqual([])
})
