import "./global.css"

import * as React from "react"
import { FlatList, Pressable, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context"
import { PortalHost } from "@/components/primitives/portal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"

type Module = { default: React.ComponentType }

const context = require.context("./examples", false, /\.tsx$/)
const EXAMPLE_FILE = /^\.\/(.+)\.tsx$/
const FULLSCREEN = /^qr-scanner-/
const INITIAL = process.env.EXPO_PUBLIC_EXAMPLE

const examples = context
  .keys()
  .map((key) => key.match(EXAMPLE_FILE)?.[1] ?? key)
  .sort()

function Example({ name }: { name: string }) {
  const { default: Component } = context(`./${name}.tsx`) as Module
  return (
    <View
      className={
        FULLSCREEN.test(name)
          ? "flex-1 bg-background"
          : "flex-1 bg-background p-4"
      }
    >
      <Component />
    </View>
  )
}

function Gallery() {
  const insets = useSafeAreaInsets()
  const [query, setQuery] = React.useState("")
  const [selected, setSelected] = React.useState(
    INITIAL && examples.includes(INITIAL) ? INITIAL : undefined
  )
  const filtered = React.useMemo(
    () => examples.filter((name) => name.includes(query.trim().toLowerCase())),
    [query]
  )

  if (selected)
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center gap-3 px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => setSelected(undefined)}
          >
            <Text>Back</Text>
          </Button>
          <Text variant="small" numberOfLines={1} className="flex-1">
            {selected}
          </Text>
        </View>
        <Separator />
        <Example name={selected} />
      </View>
    )

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="gap-3 px-4 pt-2 pb-3">
        <Text variant="h1">Examples</Text>
        <Input
          placeholder={`Search ${examples.length} examples`}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(name) => name}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelected(item)}
            className="px-4 py-3 active:bg-muted"
          >
            <Text>{item}</Text>
          </Pressable>
        )}
      />
    </View>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Gallery />
        <PortalHost />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
