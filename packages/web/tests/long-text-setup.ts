import { afterEach } from "vitest"
import { commands } from "vitest/browser"

import { findLayoutIssues } from "./layout"
import { settle } from "./settle"

const WORDS =
  "Güncellenmiş ayrıntılı açıklamalar için İstanbul şubesindeki çalışanlarımızın öğleden sonraki toplantısına katılın ğüşıöç".split(
    " "
  )

function longTurkish(original: string) {
  const target = Math.max(12, original.trim().length * 2)
  let text = ""
  let index = 0
  while (text.length < target) {
    text += `${text ? " " : ""}${WORDS[index % WORDS.length]}`
    index++
  }
  return text
}

function lengthenText(root: Element) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.textContent?.trim() &&
      !node.parentElement?.closest("script, style, [aria-hidden=true]")
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  })
  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)
  for (const node of nodes)
    node.textContent = longTurkish(node.textContent ?? "")
}

afterEach(async ({ task }) => {
  document.body.style.padding = "1rem"
  lengthenText(document.body)
  await settle()
  const found = findLayoutIssues("long-text")
  if (found.length === 0) return
  await commands.writeFile(
    `.vitest/long-text/${`${task.file.name}-${task.name}`.replace(/\W+/g, "-")}.json`,
    JSON.stringify(
      { story: `${task.file.name} > ${task.name}`, found },
      null,
      2
    )
  )
})
