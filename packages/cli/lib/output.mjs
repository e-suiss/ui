import { createInterface } from "node:readline/promises"

const useColor = process.stdout.isTTY && !process.env.NO_COLOR

const YES_ANSWER = /^y(es)?$/i

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

export function step(message) {
  console.log(`${color.green("✔")} ${message}`)
}

export function note(message) {
  console.log(`${color.yellow("•")} ${message}`)
}

export function list(paths) {
  for (const item of paths) console.log(color.dim(`  - ${item}`))
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

export async function choose(question, choices) {
  if (!process.stdin.isTTY) return choices[0]
  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  console.log(`${color.yellow("?")} ${question}`)
  choices.forEach((choice, index) => {
    console.log(color.dim(`  ${index + 1}) ${choice}`))
  })
  const answer = await prompt.question(
    color.dim(`  (1-${choices.length}, default 1) `)
  )
  prompt.close()
  const index = Number(answer.trim() || "1") - 1
  return choices[index] ?? choices[0]
}
