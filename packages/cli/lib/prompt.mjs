import { emitKeypressEvents } from "node:readline"

import { CliError, color, printable } from "./output.mjs"

const HIDE_CURSOR = "\x1b[?25l"
const SHOW_CURSOR = "\x1b[?25h"
const CLEAR_BELOW = "\x1b[J"

const MULTIPLE_HINT =
  "↑/↓ move · space select · ctrl+a select all · type to filter · enter add"
const SINGLE_HINT = "↑/↓ move · type to filter · enter choose"

export function isInteractive() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY)
}

function clip(value, width) {
  const text = printable(value)
  return text.length > width ? `${text.slice(0, width - 1)}…` : text
}

export function choose(
  message,
  choices,
  { multiple = false, input = process.stdin, output = process.stdout } = {}
) {
  return new Promise((resolve, reject) => {
    const width = Math.max(20, (output.columns || 80) - 1)
    const pageSize = Math.max(5, Math.min(12, (output.rows || 24) - 6))
    const picked = new Set()
    let query = ""
    let cursor = 0
    let offset = 0
    let drawn = 0

    const matches = () => {
      const needle = query.toLowerCase()
      const rank = (label) => {
        if (label === needle) return 0
        return label.startsWith(needle) ? 1 : 2
      }
      return choices
        .filter((choice) => choice.label.toLowerCase().includes(needle))
        .sort(
          (a, b) => rank(a.label.toLowerCase()) - rank(b.label.toLowerCase())
        )
    }

    const draw = (lines) => {
      const moveUp = drawn > 1 ? `\x1b[${drawn - 1}A` : ""
      output.write(`\r${moveUp}${CLEAR_BELOW}${lines.join("\n")}`)
      drawn = lines.length
    }

    const render = () => {
      const visible = matches()
      cursor = Math.min(cursor, Math.max(0, visible.length - 1))
      if (cursor < offset) offset = cursor
      if (cursor >= offset + pageSize) offset = cursor - pageSize + 1
      offset = Math.max(0, Math.min(offset, visible.length - pageSize))

      const lines = [
        `${color.yellow("?")} ${color.bold(message)} ${
          query ? clip(query, width) : color.dim("type to filter")
        }`,
      ]
      if (!visible.length) lines.push(color.dim("  No matches"))
      for (const [index, choice] of visible
        .slice(offset, offset + pageSize)
        .entries()) {
        const active = offset + index === cursor
        const checkbox = picked.has(choice.value)
          ? color.green("● ")
          : color.dim("○ ")
        const mark = multiple ? checkbox : ""
        const label = clip(choice.label, width - 6)
        const hint = choice.hint ? color.dim(`  ${choice.hint}`) : ""
        lines.push(
          `${active ? color.yellow("›") : " "} ${mark}${
            active ? color.bold(label) : label
          }${hint}`
        )
      }
      const position =
        visible.length > pageSize
          ? `${offset + 1}-${Math.min(offset + pageSize, visible.length)} of ${visible.length} · `
          : ""
      const count = multiple && picked.size ? `${picked.size} selected · ` : ""
      lines.push(
        color.dim(
          clip(
            `${position}${count}${multiple ? MULTIPLE_HINT : SINGLE_HINT}`,
            width
          )
        )
      )
      draw(lines)
    }

    const wasRaw = input.isRaw
    const finish = (values) => {
      input.off("keypress", onKey)
      input.setRawMode?.(wasRaw ?? false)
      input.pause()
      const summary = values
        ? `${color.green("✔")} ${color.bold(message)} ${clip(
            values
              .map(
                (value) =>
                  choices.find((choice) => choice.value === value)?.label
              )
              .join(", "),
            width
          )}`
        : `${color.red("✖")} ${color.bold(message)}`
      draw([summary])
      output.write(`\n${SHOW_CURSOR}`)
      if (values) resolve(multiple ? values : values[0])
      else reject(new CliError("Cancelled."))
    }

    const onKey = (text, key = {}) => {
      const visible = matches()
      const current = visible[cursor]

      if (key.ctrl && key.name === "c") return finish(null)
      if (key.name === "escape") {
        if (!query) return finish(null)
        query = ""
        cursor = 0
      } else if (key.name === "return") {
        if (multiple && picked.size) {
          return finish(
            choices
              .filter((choice) => picked.has(choice.value))
              .map((choice) => choice.value)
          )
        }
        if (current) return finish([current.value])
      } else if (key.name === "up") {
        if (visible.length)
          cursor = (cursor - 1 + visible.length) % visible.length
      } else if (key.name === "down") {
        if (visible.length) cursor = (cursor + 1) % visible.length
      } else if (key.name === "space") {
        if (multiple && current) {
          if (picked.has(current.value)) picked.delete(current.value)
          else picked.add(current.value)
        }
      } else if (key.ctrl && key.name === "a") {
        if (multiple) {
          const all = visible.every((choice) => picked.has(choice.value))
          for (const choice of visible) {
            if (all) picked.delete(choice.value)
            else picked.add(choice.value)
          }
        }
      } else if (key.name === "backspace") {
        query = query.slice(0, -1)
        cursor = 0
      } else if (
        text &&
        text.length === 1 &&
        text >= "!" &&
        !key.ctrl &&
        !key.meta
      ) {
        query += text
        cursor = 0
      }
      render()
    }

    emitKeypressEvents(input)
    input.setRawMode?.(true)
    input.on("keypress", onKey)
    input.resume()
    output.write(HIDE_CURSOR)
    render()
  })
}
