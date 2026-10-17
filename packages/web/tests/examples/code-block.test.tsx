import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import CodeBlockActions from "@/examples/code-block-actions"
import CodeBlockDiff from "@/examples/code-block-diff"
import CodeBlockHeader from "@/examples/code-block-header"
import CodeBlockHighlightedLines from "@/examples/code-block-highlighted-lines"
import CodeBlockHighlighting from "@/examples/code-block-highlighting"
import CodeBlockLineNumbers from "@/examples/code-block-line-numbers"
import CodeBlockShowMore from "@/examples/code-block-show-more"
import CodeBlockStartLine from "@/examples/code-block-start-line"
import CodeBlockTabs from "@/examples/code-block-tabs"
import { renderExample } from "@/tests/render-example"

function lines(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>("[data-slot=code-block-line]")
  )
}

test("Header", async () => {
  const {
    canvas,
    canvasElement: root,
    step,
  } = await renderExample(<CodeBlockHeader />)
  const writeText = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockResolvedValue(undefined)

  await step("shows the title and the output", async () => {
    await expect(canvas.getByText("Terminal")).toBeVisible()
    const content = root.querySelector("[data-slot=code-block-content]")
    await expect(content).toHaveAttribute("dir", "ltr")
    await expect(content).toHaveAttribute("tabindex", "0")
  })

  await step("copies the command", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Copy" }))
    await expect(writeText).toHaveBeenCalledWith(
      "pnpm add ai @ai-sdk/react zod"
    )
    await expect(
      await canvas.findByRole("button", { name: "Copied" })
    ).toBeVisible()
  })

  writeText.mockRestore()
})
test("Actions", async () => {
  const { canvas, canvasElement: root } = await renderExample(
    <CodeBlockActions />
  )

  const toggle = canvas.getByRole("button", { name: "Wrap lines" })
  const content = root.querySelector("[data-slot=code-block-content]")
  await expect(toggle).toHaveAttribute("aria-pressed", "true")
  await expect(content).toHaveAttribute("data-wrap")

  await userEvent.click(toggle)
  await expect(toggle).toHaveAttribute("aria-pressed", "false")
  await expect(content).not.toHaveAttribute("data-wrap")
})
test("Line Numbers", async () => {
  const { canvasElement: root } = await renderExample(<CodeBlockLineNumbers />)

  await expect(
    root.querySelector("[data-slot=code-block-content]")
  ).toHaveAttribute("data-numbered")
  await expect(lines(root)).toHaveLength(8)
})
test("Start Line", async () => {
  const { canvasElement: root } = await renderExample(<CodeBlockStartLine />)

  const content = root.querySelector<HTMLElement>(
    "[data-slot=code-block-content]"
  )
  await expect(content?.style.counterReset).toBe("line 994")
})
test("Highlighted Lines", async () => {
  const { canvasElement: root } = await renderExample(
    <CodeBlockHighlightedLines />
  )

  const highlighted = lines(root).filter(
    (line) => line.dataset.variant === "highlighted"
  )
  await expect(highlighted).toHaveLength(2)
  await expect(highlighted[0]).toHaveTextContent("reactCompiler: true,")
})
test("Diff", async () => {
  const { canvasElement: root } = await renderExample(<CodeBlockDiff />)

  const variants = lines(root).map((line) => line.dataset.variant)
  await expect(variants.filter((v) => v === "added")).toHaveLength(3)
  await expect(variants.filter((v) => v === "removed")).toHaveLength(1)
})
test("Highlighting", async () => {
  const { canvasElement: root } = await renderExample(<CodeBlockHighlighting />)

  await waitFor(
    () =>
      expect(
        root.querySelector("[data-slot=code-block-line-content] span[style]")
      ).not.toBeNull(),
    { timeout: 15000 }
  )
})
test("Show More", async () => {
  const { canvas, canvasElement: root } = await renderExample(
    <CodeBlockShowMore />
  )

  const button = canvas.getByRole("button", { name: "Show more" })
  const content = root.querySelector("[data-slot=code-block-content]")
  await expect(button).toHaveAttribute("aria-expanded", "false")
  await expect(button).toHaveAttribute("aria-controls", content?.id)
  await expect(content).toHaveClass("max-h-64")

  await userEvent.click(button)
  await expect(
    canvas.getByRole("button", { name: "Show less" })
  ).toHaveAttribute("aria-expanded", "true")
  await expect(content).not.toHaveClass("max-h-64")
})
test("Tabs", async () => {
  const { canvas } = await renderExample(<CodeBlockTabs />)

  await userEvent.click(canvas.getByRole("tab", { name: ".env.local" }))
  const panel = await canvas.findByRole("tabpanel")
  await expect(
    within(panel).getByText("AI_GATEWAY_API_KEY=your-api-key")
  ).toBeVisible()
})
