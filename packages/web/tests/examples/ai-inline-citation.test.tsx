import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import InlineCitationDemo from "@/examples/inline-citation-demo"
import { renderExample } from "@/tests/render-example"

const REACT_DEV = /react\.dev/
const SUSPENSE_LINK = /react\.dev.*opens in a new tab/

test("Default", async () => {
  const { canvas, step } = await renderExample(<InlineCitationDemo />)

  await step("links each citation to its source", async () => {
    await expect(canvas.getAllByRole("link")).toHaveLength(5)
    await expect(
      canvas.getAllByRole("link", { name: REACT_DEV })[0]
    ).toHaveAttribute("href", "https://react.dev/reference/react/Suspense")
  })

  await step("previews the source on hover", async () => {
    await userEvent.hover(
      canvas.getAllByRole("link", { name: SUSPENSE_LINK })[0] as HTMLElement
    )
    await waitFor(() =>
      expect(
        screen.getByText(
          "Display a fallback until its children have finished loading."
        )
      ).toBeVisible()
    )
  })
})
