import {
  DocsContainer,
  type DocsContainerProps,
} from "@storybook/addon-docs/blocks"
import { withThemeByClassName } from "@storybook/addon-themes"
import type { Decorator, Preview } from "@storybook/react-vite"
import { useEffect, useState } from "react"
import { GLOBALS_UPDATED } from "storybook/internal/core-events"
import { addons } from "storybook/preview-api"
import { create } from "storybook/theming/create"

import { DirectionProvider } from "@/components/ui/direction"

import "./preview.css"

type Globals = { theme?: string }

const FONT = "system-ui, sans-serif"
const docsThemes = {
  light: create({
    base: "light",
    fontBase: FONT,
    colorSecondary: "#0088ff",
    appBg: "#f2f2f7",
    appContentBg: "#ffffff",
    appPreviewBg: "#ffffff",
    appBorderColor: "rgba(60, 60, 67, 0.12)",
    textColor: "#000000",
    textMutedColor: "rgba(60, 60, 67, 0.6)",
    barBg: "#ffffff",
  }),
  dark: create({
    base: "dark",
    fontBase: FONT,
    colorSecondary: "#0091ff",
    appBg: "#1c1c1e",
    appContentBg: "#000000",
    appPreviewBg: "#000000",
    appBorderColor: "rgba(84, 84, 88, 0.5)",
    textColor: "#ffffff",
    textMutedColor: "rgba(235, 235, 245, 0.6)",
    barBg: "#1c1c1e",
  }),
}

function initialTheme(context: DocsContainerProps["context"]) {
  const store = (
    context as unknown as { store?: { userGlobals?: { globals?: Globals } } }
  ).store
  return store?.userGlobals?.globals?.theme
}

function ThemedDocsContainer({ context, ...props }: DocsContainerProps) {
  const [theme, setTheme] = useState(() => initialTheme(context))

  useEffect(() => {
    const channel = addons.getChannel()
    const update = ({ globals }: { globals: Globals }) =>
      setTheme(globals.theme)
    channel.on(GLOBALS_UPDATED, update)
    return () => channel.off(GLOBALS_UPDATED, update)
  }, [])

  return (
    <DocsContainer
      {...props}
      context={context}
      theme={theme === "dark" ? docsThemes.dark : docsThemes.light}
    />
  )
}

type Direction = "ltr" | "rtl"

const withDirection: Decorator = (Story, context) => {
  const direction: Direction =
    context.globals.direction ??
    (globalThis as { storybookDirection?: Direction }).storybookDirection ??
    "ltr"
  document.documentElement.dir = direction
  return (
    <DirectionProvider direction={direction}>
      <Story />
    </DirectionProvider>
  )
}

const preview: Preview = {
  globalTypes: {
    direction: {
      description: "Text direction",
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { value: "ltr", title: "Left to right" },
          { value: "rtl", title: "Right to left" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withDirection,
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
  ],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    docs: {
      container: ThemedDocsContainer,
    },
  },
  tags: ["autodocs"],
}

export default preview
