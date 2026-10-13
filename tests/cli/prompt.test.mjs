import { PassThrough } from "node:stream"
import { describe, expect, it } from "vitest"

import { CliError } from "../../packages/cli/lib/output.mjs"
import { choose } from "../../packages/cli/lib/prompt.mjs"

const KEYS = {
  up: "\x1b[A",
  down: "\x1b[B",
  space: " ",
  enter: "\r",
  backspace: "\x7f",
  selectAll: "\x01",
  cancel: "\x03",
}

const choices = ["accordion", "button", "button-group", "dialog"].map(
  (name) => ({ value: name, label: name })
)

function terminal() {
  const input = new PassThrough()
  input.isTTY = true
  input.isRaw = false
  input.setRawMode = (mode) => {
    input.isRaw = mode
  }
  const output = new PassThrough()
  output.columns = 80
  output.rows = 24
  let screen = ""
  output.on("data", (chunk) => {
    screen += chunk
  })
  return { input, output, screen: () => screen }
}

function run(keys, options) {
  const term = terminal()
  const answer = choose("Which components?", choices, {
    ...options,
    input: term.input,
    output: term.output,
  })
  for (const key of keys) term.input.write(key)
  return { answer, term }
}

describe("choose", () => {
  it("returns the highlighted choice", async () => {
    const { answer } = run([KEYS.down, KEYS.enter])
    await expect(answer).resolves.toBe("button")
  })

  it("wraps around from the first choice to the last", async () => {
    const { answer } = run([KEYS.up, KEYS.enter])
    await expect(answer).resolves.toBe("dialog")
  })

  it("filters the choices by what is typed", async () => {
    const { answer } = run(["d", "i", "a", KEYS.enter])
    await expect(answer).resolves.toBe("dialog")
  })

  it("lists prefix matches before other matches", async () => {
    const { answer } = run(["d", KEYS.enter])
    await expect(answer).resolves.toBe("dialog")
  })

  it("edits the filter with backspace", async () => {
    const { answer } = run(["l", "x", KEYS.backspace, KEYS.enter])
    await expect(answer).resolves.toBe("dialog")
  })

  it("does not choose anything when nothing matches", async () => {
    const { answer, term } = run(["z", KEYS.enter, KEYS.backspace, KEYS.enter])
    await expect(answer).resolves.toBe("accordion")
    expect(term.screen()).toContain("No matches")
  })

  it("returns every selected choice in list order", async () => {
    const { answer } = run(
      [
        KEYS.down,
        KEYS.down,
        KEYS.down,
        KEYS.space,
        KEYS.up,
        KEYS.up,
        KEYS.space,
        KEYS.enter,
      ],
      { multiple: true }
    )
    await expect(answer).resolves.toEqual(["button", "dialog"])
  })

  it("returns the highlighted choice when nothing is selected", async () => {
    const { answer } = run([KEYS.down, KEYS.enter], { multiple: true })
    await expect(answer).resolves.toEqual(["button"])
  })

  it("unselects a choice selected twice", async () => {
    const { answer } = run([KEYS.space, KEYS.space, KEYS.down, KEYS.enter], {
      multiple: true,
    })
    await expect(answer).resolves.toEqual(["button"])
  })

  it("selects every filtered choice with ctrl+a", async () => {
    const { answer } = run(["b", "u", "t", KEYS.selectAll, KEYS.enter], {
      multiple: true,
    })
    await expect(answer).resolves.toEqual(["button", "button-group"])
  })

  it("clears the selection when ctrl+a is pressed again", async () => {
    const { answer } = run(
      [KEYS.selectAll, KEYS.selectAll, KEYS.down, KEYS.enter],
      { multiple: true }
    )
    await expect(answer).resolves.toEqual(["button"])
  })

  it("cancels with ctrl+c and restores the terminal", async () => {
    const { answer, term } = run([KEYS.cancel])
    await expect(answer).rejects.toThrow(CliError)
    await expect(answer).rejects.toThrow("Cancelled.")
    expect(term.input.isRaw).toBe(false)
    expect(term.screen()).toContain("\x1b[?25h")
  })

  it("shows the choices and the hint", async () => {
    const { answer, term } = run([KEYS.enter])
    await answer
    const screen = term.screen()
    for (const { label } of choices) expect(screen).toContain(label)
    expect(screen).toContain("type to filter")
  })
})
