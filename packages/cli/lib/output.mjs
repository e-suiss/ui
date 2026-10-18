import { createInterface } from "node:readline/promises"

const useColor = process.stdout.isTTY && !process.env.NO_COLOR

const YES_ANSWER = /^y(es)?$/i
const TAB = 9
const NEWLINE = 10
const INVISIBLE =
  /[\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u2069\ufeff]/

function paint(code, text) {
  return useColor ? `\x1b[${code}m${text}\x1b[0m` : text
}

export const color = {
  green: (text) => paint(32, text),
  red: (text) => paint(31, text),
  yellow: (text) => paint(33, text),
  dim: (text) => paint(2, text),
  bold: (text) => paint(1, text),
}

export class CliError extends Error {}

function isControl(char) {
  const code = char.charCodeAt(0)
  if (code === TAB || code === NEWLINE) return false
  return code < 32 || (code >= 127 && code < 160) || INVISIBLE.test(char)
}

export function printable(text) {
  return Array.from(String(text))
    .filter((char) => !isControl(char))
    .join("")
}

export function revealed(text) {
  return printable(
    String(text).replace(
      new RegExp(INVISIBLE.source, "g"),
      (char) =>
        `<U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}>`
    )
  )
}

export function step(message) {
  console.log(`${color.green("✔")} ${printable(message)}`)
}

export function note(message) {
  console.log(`${color.yellow("•")} ${printable(message)}`)
}

export function list(paths) {
  for (const item of paths) console.log(color.dim(`  - ${printable(item)}`))
}

export async function confirm(question) {
  if (!process.stdin.isTTY) return false
  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  const answer = await prompt.question(
    `${color.yellow("?")} ${question} ${color.dim("(y/N)")} `
  )
  prompt.close()
  return YES_ANSWER.test(answer.trim())
}
