import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { captureScreen } from "react-native-view-shot"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Text } from "@/components/ui/text"
import {
  type Theme,
  ThemeProvider,
  type ThemeStorage,
  ThemeToggle,
  type ThemeTransition,
  useTheme,
} from "@/components/ui/theme"

function Preview() {
  const { theme, resolvedTheme } = useTheme()
  return (
    <View className="w-full gap-6">
      <View className="gap-2">
        <Text variant="h2">Light and dark.</Text>
        <Text className="text-label-secondary">
          Every surface, label and accent follows the theme tokens, so the whole
          app changes at once.
        </Text>
      </View>
      <ThemeToggle />
      <View className="gap-1 rounded-2xl bg-surface-secondary p-4">
        <Text className="text-sm text-label-secondary">Selected</Text>
        <Text className="font-semibold">{theme}</Text>
        <Text className="mt-2 text-sm text-label-secondary">Showing</Text>
        <Text className="font-semibold">{resolvedTheme}</Text>
      </View>
    </View>
  )
}

function TransitionPreview({ effect, origin, blur }: ThemeTransition) {
  return (
    <View className="w-full gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Light and dark.</CardTitle>
          <CardDescription>
            The old theme stays on top and the new one grows out of the shape.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Text className="text-sm text-label-secondary">
            Pick a theme below to watch the transition.
          </Text>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button block>
            <Text>Continue</Text>
          </Button>
          <Button block variant="secondary">
            <Text>Not now</Text>
          </Button>
        </CardFooter>
      </Card>
      <ThemeToggle effect={effect} origin={origin} blur={blur} />
    </View>
  )
}

function snapshot() {
  return captureScreen().then((uri) => ({ uri }))
}

function Demo({
  defaultTheme,
  storage,
  effect,
  origin,
  blur,
}: ThemeTransition & {
  defaultTheme: Theme
  storage?: ThemeStorage
}) {
  const transition =
    effect !== undefined || origin !== undefined || blur !== undefined
  return (
    <ThemeProvider
      defaultTheme={defaultTheme}
      storage={storage}
      storageKey="theme-story"
      snapshot={transition ? snapshot : undefined}
    >
      {transition ? (
        <TransitionPreview effect={effect} origin={origin} blur={blur} />
      ) : (
        <Preview />
      )}
    </ThemeProvider>
  )
}

const meta = {
  title: "Components/Theme",
  component: Demo,
  args: { defaultTheme: "system" },
} satisfies Meta<typeof Demo>

export default meta

type Story = StoryObj<typeof meta>

export const System: Story = {}

export const Light: Story = {
  args: { defaultTheme: "light" },
}

export const Dark: Story = {
  args: { defaultTheme: "dark" },
}

const savedDark = new Map<string, string>([["theme-story", "dark"]])

export const WithStorage: Story = {
  args: {
    defaultTheme: "light",
    storage: {
      getItem: (key) => Promise.resolve(savedDark.get(key) ?? null),
      setItem: (key, value) => {
        savedDark.set(key, value)
      },
    },
  },
}

export const Circle: Story = {
  args: { defaultTheme: "light", effect: "circle", origin: "center" },
}

export const CircleFromCorner: Story = {
  args: { defaultTheme: "light", effect: "circle", origin: "top-right" },
}

export const CircleFromEdge: Story = {
  args: { defaultTheme: "light", effect: "circle", origin: "bottom-center" },
}

export const Rectangle: Story = {
  args: { defaultTheme: "light", effect: "rectangle", origin: "bottom-up" },
}

export const RectangleSideways: Story = {
  args: { defaultTheme: "light", effect: "rectangle", origin: "left-right" },
}

export const Polygon: Story = {
  args: { defaultTheme: "light", effect: "polygon", origin: "top-left" },
}

export const CircleBlur: Story = {
  args: { defaultTheme: "light", effect: "circle-blur", origin: "center" },
}

export const CircleBlurFromCorner: Story = {
  args: {
    defaultTheme: "light",
    effect: "circle-blur",
    origin: "bottom-right",
  },
}

export const Blurred: Story = {
  args: {
    defaultTheme: "light",
    effect: "circle",
    origin: "center",
    blur: true,
  },
}
