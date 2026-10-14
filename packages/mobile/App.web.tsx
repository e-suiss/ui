import "./.rnstorybook/global.css"
import "./web.css"

import * as React from "react"
import { View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Uniwind } from "uniwind"
import { PortalHost } from "@/components/primitives/portal"

type Args = Record<string, unknown>
type Context = {
  args: Args
  parameters: Record<string, unknown>
  globals: Record<string, unknown>
  viewMode: "story"
}
type Decorator = (
  Story: React.ComponentType,
  context: Context
) => React.ReactNode
type Story = {
  args?: Args
  parameters?: Record<string, unknown>
  decorators?: Decorator[]
  render?: (args: Args, context: Context) => React.ReactNode
}
type Meta = Story & { component?: React.ComponentType<Args> }
type Module = Record<string, unknown> & { default?: Meta }
type Theme = "light" | "dark"

const stories = require.context(
  "./stories",
  false,
  /^\.\/(attachment|button|carousel|combobox|dialog)\.stories\.tsx$/,
  "lazy"
)

function readParams() {
  const params = new URLSearchParams(window.location.search)
  return {
    file: params.get("file") ?? "",
    name: params.get("story") ?? "Default",
    theme: (params.get("theme") === "dark" ? "dark" : "light") as Theme,
  }
}

function StoryView({ meta, story }: { meta: Meta; story: Story }) {
  const args: Args = { ...meta.args, ...story.args }
  const parameters = { ...meta.parameters, ...story.parameters }
  const context: Context = { args, parameters, globals: {}, viewMode: "story" }
  const render = story.render ?? meta.render
  let Rendered: React.ComponentType = function Base() {
    if (render) return <>{render(args, context)}</>
    const Component = meta.component
    return Component ? <Component {...args} /> : null
  }
  for (const decorate of [
    ...(story.decorators ?? []),
    ...(meta.decorators ?? []),
  ]) {
    const Inner: React.ComponentType = Rendered
    Rendered = function Decorated(): React.ReactNode {
      return <>{decorate(Inner, context)}</>
    }
  }
  return (
    <View
      className={
        parameters.layout === "fullscreen"
          ? "flex-1 bg-surface"
          : "flex-1 bg-surface p-4"
      }
    >
      <Rendered />
    </View>
  )
}

export default function App() {
  const [{ file, name, theme }] = React.useState(readParams)
  const [module, setModule] = React.useState<Module>()

  React.useLayoutEffect(() => {
    Uniwind.setTheme(theme)
    const onMessage = (event: MessageEvent) => {
      const next = event.data?.theme
      if (next === "light" || next === "dark") Uniwind.setTheme(next)
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [theme])

  React.useEffect(() => {
    const key = `./${file}.stories.tsx`
    if (!stories.keys().includes(key)) return
    Promise.resolve(stories(key) as Promise<Module> | Module).then(setModule)
  }, [file])

  const story = module?.[name] as Story | undefined

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View className="flex-1 bg-surface">
          {module?.default && story ? (
            <StoryView meta={module.default} story={story} />
          ) : null}
        </View>
        <PortalHost />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
