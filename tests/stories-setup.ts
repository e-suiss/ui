import { afterEach, beforeEach, expect, type MockInstance, vi } from "vitest"

let errors: string[] = []
let consoleError: MockInstance | undefined

beforeEach(() => {
  errors = []
  consoleError = vi
    .spyOn(console, "error")
    .mockImplementation((...args: unknown[]) => {
      errors.push(args.map(String).join(" "))
    })
})

afterEach(() => {
  consoleError?.mockRestore()
  expect(errors, "console.error was called while rendering").toEqual([])
})
