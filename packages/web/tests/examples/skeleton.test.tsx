import { expect, test } from "vitest"
import SkeletonDemo from "@/examples/skeleton-demo"
import SkeletonList from "@/examples/skeleton-list"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvasElement, step } = await renderExample(<SkeletonDemo />)

  await step("renders a pulsing placeholder with no text", async () => {
    const skeleton = canvasElement.querySelector('[data-slot="skeleton"]')
    await expect(skeleton).toHaveClass("animate-pulse")
    await expect(skeleton).toBeEmptyDOMElement()
  })
})
test("List", async () => {
  const { canvasElement, step } = await renderExample(<SkeletonList />)

  await step("renders three placeholders per row", async () => {
    await expect(
      canvasElement.querySelectorAll('[data-slot="skeleton"]')
    ).toHaveLength(12)
  })
})
