import { color } from "./output.mjs"

const CONTEXT = 3

function diffLines(before, after) {
  const table = Array.from(
    { length: before.length + 1 },
    () => new Uint32Array(after.length + 1)
  )
  for (let i = before.length - 1; i >= 0; i--) {
    for (let j = after.length - 1; j >= 0; j--) {
      table[i][j] =
        before[i] === after[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }

  const operations = []
  let i = 0
  let j = 0
  while (i < before.length && j < after.length) {
    if (before[i] === after[j]) {
      operations.push([" ", before[i++]])
      j++
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      operations.push(["-", before[i++]])
    } else {
      operations.push(["+", after[j++]])
    }
  }
  while (i < before.length) operations.push(["-", before[i++]])
  while (j < after.length) operations.push(["+", after[j++]])
  return operations
}

export function formatDiff(before, after) {
  const operations = diffLines(before.split("\n"), after.split("\n"))
  const changed = operations.flatMap(([kind], index) =>
    kind === " " ? [] : [index]
  )
  if (!changed.length) return ""

  const visible = new Set()
  for (const index of changed) {
    for (let k = index - CONTEXT; k <= index + CONTEXT; k++) visible.add(k)
  }

  const lines = []
  let previous = -1
  operations.forEach(([kind, text], index) => {
    if (!visible.has(index)) return
    if (previous !== -1 && index !== previous + 1)
      lines.push(color.dim("  ..."))
    previous = index
    if (kind === "+") lines.push(color.green(`+ ${text}`))
    else if (kind === "-") lines.push(color.red(`- ${text}`))
    else lines.push(color.dim(`  ${text}`))
  })
  return lines.join("\n")
}
