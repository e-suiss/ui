import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SidebarCollapsed from "@/examples/sidebar-collapsed"
import SidebarDemo from "@/examples/sidebar-demo"
import SidebarFloating from "@/examples/sidebar-floating"
import SidebarInsetExample from "@/examples/sidebar-inset"
import SidebarLoading from "@/examples/sidebar-loading"
import SidebarOffcanvas from "@/examples/sidebar-offcanvas"
import SidebarRightSide from "@/examples/sidebar-right-side"
import { type ExampleContext, renderExample } from "@/tests/render-example"

function bySlot(canvasElement: HTMLElement, slot: string) {
  const element = canvasElement.querySelector<HTMLElement>(
    `[data-slot="${slot}"]`
  )
  if (!element) throw new Error(`${slot} not rendered`)
  return element
}
function sidebarElement(canvasElement: HTMLElement) {
  return bySlot(canvasElement, "sidebar")
}
async function collapsesAndExpands(
  { canvas, canvasElement, step }: ExampleContext,
  variant: string
) {
  const sidebar = sidebarElement(canvasElement)

  await step(`renders the ${variant} variant expanded`, async () => {
    await expect(sidebar).toHaveAttribute("data-variant", variant)
    await expect(sidebar).toHaveAttribute("data-state", "expanded")
    await expect(canvas.getByRole("link", { name: "Home" })).toBeVisible()
  })

  await step("collapses to icons from the trigger", async () => {
    await userEvent.click(bySlot(canvasElement, "sidebar-trigger"))
    await expect(sidebar).toHaveAttribute("data-state", "collapsed")
    await expect(sidebar).toHaveAttribute("data-collapsible", "icon")
  })

  await step("expands again from the rail", async () => {
    await userEvent.click(bySlot(canvasElement, "sidebar-rail"))
    await expect(sidebar).toHaveAttribute("data-state", "expanded")
  })
}

test("Default", async () => {
  const { canvas, canvasElement, step } = await renderExample(<SidebarDemo />)

  const sidebar = sidebarElement(canvasElement)
  const trigger = bySlot(canvasElement, "sidebar-trigger")

  await step("renders the navigation expanded", async () => {
    await expect(sidebar).toHaveAttribute("data-state", "expanded")
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute(
      "data-active"
    )
    await expect(canvas.getByText("12")).toBeVisible()
  })

  await step("collapses to icons from the trigger", async () => {
    await userEvent.click(trigger)
    await expect(sidebar).toHaveAttribute("data-state", "collapsed")
    await expect(sidebar).toHaveAttribute("data-collapsible", "icon")
  })

  await step("shows a tooltip for an icon while collapsed", async () => {
    await userEvent.hover(canvas.getByRole("link", { name: "Inbox" }))
    await waitFor(() =>
      expect(
        document.querySelector('[data-slot="tooltip-content"]')
      ).toHaveTextContent("Inbox")
    )
    await userEvent.unhover(canvas.getByRole("link", { name: "Inbox" }))
  })

  await step("expands again with the keyboard shortcut", async () => {
    await userEvent.keyboard("{Control>}b{/Control}{Meta>}b{/Meta}")
    await expect(sidebar).toHaveAttribute("data-state", "expanded")
  })
})
test("Right To Left", async () => {
  const { canvasElement, step } = await renderExample(<SidebarDemo />, {
    direction: "rtl",
  })

  const container = bySlot(canvasElement, "sidebar-container")
  const inset = bySlot(canvasElement, "sidebar-inset")

  await step("puts the sidebar on the right next to the content", async () => {
    await waitFor(() =>
      expect(container.getBoundingClientRect().right).toBeCloseTo(
        document.body.getBoundingClientRect().right -
          Number.parseFloat(getComputedStyle(document.body).paddingRight),
        0
      )
    )
    await expect(inset.getBoundingClientRect().right).toBeLessThanOrEqual(
      container.getBoundingClientRect().left + 1
    )
  })
})
test("Floating", async () => {
  const context = await renderExample(<SidebarFloating />)
  await collapsesAndExpands(context, "floating")
})
test("Inset", async () => {
  const context = await renderExample(<SidebarInsetExample />)
  await collapsesAndExpands(context, "inset")
})
test("Collapsed", async () => {
  const { canvasElement, step } = await renderExample(<SidebarCollapsed />)

  const sidebar = sidebarElement(canvasElement)

  await step("starts collapsed and expands from the rail", async () => {
    await expect(sidebar).toHaveAttribute("data-state", "collapsed")
    await userEvent.click(bySlot(canvasElement, "sidebar-rail"))
    await expect(sidebar).toHaveAttribute("data-state", "expanded")
  })
})
test("Offcanvas", async () => {
  const { canvasElement, step } = await renderExample(<SidebarOffcanvas />)

  const sidebar = sidebarElement(canvasElement)

  await step("slides fully off canvas when collapsed", async () => {
    await userEvent.click(bySlot(canvasElement, "sidebar-trigger"))
    await expect(sidebar).toHaveAttribute("data-collapsible", "offcanvas")
  })
})
test("Right Side", async () => {
  const { canvasElement, step } = await renderExample(<SidebarRightSide />)

  await step("places the sidebar on the right", async () => {
    await expect(sidebarElement(canvasElement)).toHaveAttribute(
      "data-side",
      "right"
    )
  })
})
test("Loading", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <SidebarLoading />
  )

  await step("renders placeholders instead of links", async () => {
    await expect(
      canvasElement.querySelectorAll('[data-slot="sidebar-menu-skeleton"]')
    ).toHaveLength(7)
    await expect(canvas.queryAllByRole("link")).toHaveLength(0)
  })
})
