import type { Meta, StoryObj } from "@storybook/react-vite"
import type * as React from "react"
import { expect, userEvent, waitFor } from "storybook/test"
import { Button } from "@/components/ui/button"
import {
  type Theme,
  ThemeProvider,
  ThemeToggle,
  useTheme,
} from "@/components/ui/theme"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const STORY_KEY = "esuiss-theme-story"

function clearStoredTheme() {
  try {
    localStorage.removeItem(STORY_KEY)
    return true
  } catch {
    return false
  }
}

function StoryTheme({
  toolbar,
  children,
}: {
  toolbar?: string
  children?: React.ReactNode
}) {
  const theme = toolbar === "dark" ? "dark" : "light"
  clearStoredTheme()

  return (
    <ThemeProvider key={theme} defaultTheme={theme} storageKey={STORY_KEY}>
      {children}
    </ThemeProvider>
  )
}

const meta = {
  title: "Components/Theme",
  component: ThemeToggle,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story, context) => (
      <StoryTheme toolbar={context.globals.theme}>
        <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-surface px-6 py-16 text-center text-label">
          <div className="flex max-w-md flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">
              Light and dark.
            </h1>
            <p className="text-lg text-label-secondary">
              Every surface, label and accent follows the theme tokens, so the
              whole page changes at once.
            </p>
          </div>
          <Story />
        </div>
      </StoryTheme>
    ),
  ],
  argTypes: {
    effect: {
      control: "inline-radio",
      options: ["circle", "rectangle", "polygon", "circle-blur"],
    },
    origin: {
      control: "select",
      options: [
        "center",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "top-center",
        "bottom-center",
        "bottom-up",
        "top-down",
        "left-right",
        "right-left",
      ],
    },
    blur: { control: "boolean" },
  },
} satisfies Meta<typeof ThemeToggle>

export default meta

type Story = StoryObj<typeof meta>

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
): Story["play"] {
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

export const Circle: Story = {
  args: { effect: "circle", origin: "center" },
  play: async ({ canvas, step }) => {
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
  },
}

export const CircleFromCorner: Story = {
  args: { effect: "circle", origin: "top-right" },
  play: playTransition(
    "circle",
    "--theme-transition-from",
    "circle(0% at 100% 0%)"
  ),
}

export const CircleFromEdge: Story = {
  args: { effect: "circle", origin: "bottom-center" },
  play: playTransition(
    "circle",
    "--theme-transition-from",
    "circle(0% at 50% 100%)"
  ),
}

export const Rectangle: Story = {
  args: { effect: "rectangle", origin: "bottom-up" },
  play: playTransition(
    "rectangle",
    "--theme-transition-from",
    "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
  ),
}

export const RectangleSideways: Story = {
  args: { effect: "rectangle", origin: "left-right" },
  play: playTransition(
    "rectangle",
    "--theme-transition-from",
    "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
  ),
}

export const Polygon: Story = {
  args: { effect: "polygon", origin: "top-left" },
  play: playTransition(
    "polygon",
    "--theme-transition-from",
    "polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%)"
  ),
}

export const CircleBlur: Story = {
  args: { effect: "circle-blur", origin: "center" },
  play: playTransition("circle-blur", "--theme-transition-at", "50% 50%"),
}

export const CircleBlurFromCorner: Story = {
  args: { effect: "circle-blur", origin: "bottom-right" },
  play: playTransition("circle-blur", "--theme-transition-at", "100% 100%"),
}

export const Blurred: Story = {
  args: { effect: "circle", origin: "center", blur: true },
  play: playTransition(
    "circle",
    "--theme-transition-from",
    "circle(0% at 50% 50%)",
    true
  ),
}

function ThemePicker() {
  const { theme, setTheme } = useTheme()

  return (
    <ToggleGroup
      spacing={0}
      value={[theme]}
      onValueChange={(value: string[]) => {
        if (value[0])
          setTheme(value[0] as Theme, {
            effect: "circle",
            origin: "top-center",
          })
      }}
      aria-label="Appearance"
    >
      {(["light", "dark", "system"] as const).map((item) => (
        <ToggleGroupItem key={item} value={item} className="px-5 capitalize">
          {item}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export const LightDarkSystem: Story = {
  render: () => <ThemePicker />,
  play: async ({ canvas, step }) => {
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
  },
}

function InstantSwitch() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="secondary"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      Switch theme instantly
    </Button>
  )
}

export const WithoutTransition: Story = {
  render: () => <InstantSwitch />,
  play: async ({ canvas, step }) => {
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
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <ThemeToggle {...args} size="icon" />
      <ThemeToggle {...args} />
      <ThemeToggle {...args} size="icon-xl" />
    </div>
  ),
  play: async ({ canvas, step }) => {
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
  },
}

function ThemeStatus() {
  const { theme, resolvedTheme } = useTheme()

  return (
    <div className="flex flex-col items-center gap-3">
      <ThemeToggle />
      <p className="text-sm text-label-secondary" aria-live="polite">
        Theme: {theme} · Showing: {resolvedTheme ?? "…"}
      </p>
    </div>
  )
}

export const Status: Story = {
  render: () => <ThemeStatus />,
  play: async ({ canvas, step }) => {
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
  },
}
