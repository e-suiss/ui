import { afterEach, beforeEach, expect, type MockInstance, vi } from "vitest"

const TEST_ONLY_WARNINGS = [
  "ResizeObserver loop completed with undelivered notifications",
  "not wrapped in act(...)",
  "suspended inside an `act` scope",
]

let errors: string[] = []
let consoleError: MockInstance | undefined

beforeEach(() => {
  errors = []
  consoleError = vi
    .spyOn(console, "error")
    .mockImplementation((...args: unknown[]) => {
      const message = args.map(String).join(" ")
      if (!TEST_ONLY_WARNINGS.some((warning) => message.includes(warning)))
        errors.push(message)
    })
})

afterEach(() => {
  consoleError?.mockRestore()
  expect(errors, "console.error was called while rendering").toEqual([])
})
