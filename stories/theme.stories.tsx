import type { Meta, StoryObj } from "@storybook/react-vite"
import type * as React from "react"
import { Button } from "@/components/ui/button"
import {
  type Theme,
  ThemeProvider,
  ThemeToggle,
  useTheme,
} from "@/components/ui/theme"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const STORY_KEY = "esuiss-theme-story"

function StoryTheme({
  toolbar,
  children,
}: {
  toolbar?: string
  children?: React.ReactNode
}) {
  const theme = toolbar === "dark" ? "dark" : "light"
  try {
    localStorage.removeItem(STORY_KEY)
  } catch {}

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

export const Circle: Story = { args: { effect: "circle", origin: "center" } }

export const CircleFromCorner: Story = {
  args: { effect: "circle", origin: "top-right" },
}

export const CircleFromEdge: Story = {
  args: { effect: "circle", origin: "bottom-center" },
}

export const Rectangle: Story = {
  args: { effect: "rectangle", origin: "bottom-up" },
}

export const RectangleSideways: Story = {
  args: { effect: "rectangle", origin: "left-right" },
}

export const Polygon: Story = {
  args: { effect: "polygon", origin: "top-left" },
}

export const CircleBlur: Story = {
  args: { effect: "circle-blur", origin: "center" },
}

export const CircleBlurFromCorner: Story = {
  args: { effect: "circle-blur", origin: "bottom-right" },
}

export const Blurred: Story = {
  args: { effect: "circle", origin: "center", blur: true },
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
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <ThemeToggle {...args} size="icon" />
      <ThemeToggle {...args} />
      <ThemeToggle {...args} size="icon-xl" />
    </div>
  ),
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
}
