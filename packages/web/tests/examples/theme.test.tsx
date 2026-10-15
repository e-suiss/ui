import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ThemeBlurred from "@/examples/theme-blurred"
import ThemeCircle from "@/examples/theme-circle"
import ThemeCircleBlur from "@/examples/theme-circle-blur"
import ThemeCircleBlurFromCorner from "@/examples/theme-circle-blur-from-corner"
import ThemeCircleFromCorner from "@/examples/theme-circle-from-corner"
import ThemeCircleFromEdge from "@/examples/theme-circle-from-edge"
import ThemeLightDarkSystem from "@/examples/theme-light-dark-system"
import ThemePolygon from "@/examples/theme-polygon"
import ThemeRectangle from "@/examples/theme-rectangle"
import ThemeRectangleSideways from "@/examples/theme-rectangle-sideways"
import ThemeSizes from "@/examples/theme-sizes"
import ThemeStatusExample from "@/examples/theme-status"
import ThemeWithoutTransition from "@/examples/theme-without-transition"
import { type ExampleContext, renderExample } from "@/tests/render-example"

const root = () => document.documentElement
async function transitionSettled() {
  await waitFor(
    () => expect(root()).not.toHaveAttribute("data-theme-transition"),
    { timeout: 3000 }
  )
}
function playTransition(
  effect: string,
  variable: string,
  value: string,
  blur = false
): (context: ExampleContext) => Promise<void> {
  return async ({ canvas, step }) => {
    await step(`switches to dark with the ${effect} transition`, async () => {
      await transitionSettled()
      await userEvent.click(
        await canvas.findByRole("button", { name: "Switch to dark theme" })
      )
      await expect(root()).toHaveAttribute("data-theme-transition", effect)
      await expect(root().hasAttribute("data-theme-transition-blur")).toBe(blur)
      await expect(root().style.getPropertyValue(variable)).toBe(value)
      await waitFor(() => expect(root()).toHaveClass("dark"))
      await transitionSettled()
      await expect(root().style.getPropertyValue(variable)).toBe("")
    })

    await step("switches back to light", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Switch to light theme" })
      )
      await expect(root()).toHaveAttribute("data-theme-transition", effect)
      await waitFor(() => expect(root()).not.toHaveClass("dark"))
      await transitionSettled()
    })
  }
}

test("Circle", async () => {
  const { canvas, step } = await renderExample(<ThemeCircle />)

  await step("switches to dark and renames the toggle", async () => {
    await userEvent.click(
      await canvas.findByRole("button", { name: "Switch to dark theme" })
    )
    await waitFor(() => expect(root()).toHaveClass("dark"))
    await expect(
      await canvas.findByRole("button", { name: "Switch to light theme" })
    ).toHaveAttribute("data-dark")
  })

  await step("switches back to light", async () => {
    await transitionSettled()
    await userEvent.click(
      canvas.getByRole("button", { name: "Switch to light theme" })
    )
    await waitFor(() => expect(root()).not.toHaveClass("dark"))
    await transitionSettled()
  })
})
test("Circle From Corner", async () => {
  const context = await renderExample(<ThemeCircleFromCorner />)
  await playTransition(
    "circle",
    "--theme-transition-from",
    "circle(0% at 100% 0%)"
  )(context)
})
test("Circle From Edge", async () => {
  const context = await renderExample(<ThemeCircleFromEdge />)
  await playTransition(
    "circle",
    "--theme-transition-from",
    "circle(0% at 50% 100%)"
  )(context)
})
test("Rectangle", async () => {
  const context = await renderExample(<ThemeRectangle />)
  await playTransition(
    "rectangle",
    "--theme-transition-from",
    "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
  )(context)
})
test("Rectangle Sideways", async () => {
  const context = await renderExample(<ThemeRectangleSideways />)
  await playTransition(
    "rectangle",
    "--theme-transition-from",
    "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
  )(context)
})
test("Polygon", async () => {
  const context = await renderExample(<ThemePolygon />)
  await playTransition(
    "polygon",
    "--theme-transition-from",
    "polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%)"
  )(context)
})
test("Circle Blur", async () => {
  const context = await renderExample(<ThemeCircleBlur />)
  await playTransition(
    "circle-blur",
    "--theme-transition-at",
    "50% 50%"
  )(context)
})
test("Circle Blur From Corner", async () => {
  const context = await renderExample(<ThemeCircleBlurFromCorner />)
  await playTransition(
    "circle-blur",
    "--theme-transition-at",
    "100% 100%"
  )(context)
})
test("Blurred", async () => {
  const context = await renderExample(<ThemeBlurred />)
  await playTransition(
    "circle",
    "--theme-transition-from",
    "circle(0% at 50% 50%)",
    true
  )(context)
})
test("Light Dark System", async () => {
  const { canvas, step } = await renderExample(<ThemeLightDarkSystem />)

  const light = canvas.getByRole("button", { name: "light" })
  const dark = canvas.getByRole("button", { name: "dark" })

  await step("picks dark from the segmented control", async () => {
    await waitFor(() => expect(light).toHaveAttribute("aria-pressed", "true"))
    await userEvent.click(dark)
    await waitFor(() => expect(root()).toHaveClass("dark"))
    await expect(dark).toHaveAttribute("aria-pressed", "true")
  })

  await step("returns to light", async () => {
    await transitionSettled()
    await userEvent.click(light)
    await waitFor(() => expect(root()).not.toHaveClass("dark"))
    await expect(light).toHaveAttribute("aria-pressed", "true")
    await transitionSettled()
  })
})
test("Without Transition", async () => {
  const { canvas, step } = await renderExample(<ThemeWithoutTransition />)

  const button = canvas.getByRole("button", {
    name: "Switch theme instantly",
  })

  await step("flips the theme without a view transition", async () => {
    await userEvent.click(button)
    await expect(root()).toHaveClass("dark")
    await expect(root()).not.toHaveAttribute("data-theme-transition")
    await userEvent.click(button)
    await expect(root()).not.toHaveClass("dark")
  })
})
test("Sizes", async () => {
  const { canvas, step } = await renderExample(<ThemeSizes />)

  await step("every size toggles the shared theme", async () => {
    await transitionSettled()
    const toggles = await canvas.findAllByRole("button", {
      name: "Switch to dark theme",
    })
    await expect(toggles).toHaveLength(3)
    const [smallest] = toggles
    if (smallest) await userEvent.click(smallest)
    await waitFor(() => expect(root()).toHaveClass("dark"))
    await expect(
      await canvas.findAllByRole("button", { name: "Switch to light theme" })
    ).toHaveLength(3)
    await transitionSettled()
  })

  await step("the largest size switches back", async () => {
    const [, , largest] = canvas.getAllByRole("button", {
      name: "Switch to light theme",
    })
    if (largest) await userEvent.click(largest)
    await waitFor(() => expect(root()).not.toHaveClass("dark"))
    await transitionSettled()
  })
})
test("Status", async () => {
  const { canvas, step } = await renderExample(<ThemeStatusExample />)

  await step("reports the chosen and resolved theme", async () => {
    await expect(
      await canvas.findByText("Theme: light · Showing: light")
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole("button", { name: "Switch to dark theme" })
    )
    await expect(
      await canvas.findByText("Theme: dark · Showing: dark")
    ).toBeVisible()
    await transitionSettled()
    await userEvent.click(
      canvas.getByRole("button", { name: "Switch to light theme" })
    )
    await waitFor(() => expect(root()).not.toHaveClass("dark"))
    await transitionSettled()
  })
})
