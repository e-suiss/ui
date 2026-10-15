import { cn } from "cn"
import { MagnifyingGlassIcon, XIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, ScrollView, type TextInput, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

const SUGGESTIONS = ["Book Air", "Book Pro", "Book mini", "Compare Book models"]

function EmptySearch() {
  const [query, setQuery] = React.useState("book neo")
  const [focused, setFocused] = React.useState(false)
  const inputRef = React.useRef<React.ComponentRef<typeof TextInput>>(null)
  const trimmed = query.trim().toLowerCase()
  const matches =
    trimmed.length > 0 && trimmed.startsWith("book")
      ? SUGGESTIONS.filter((item) => item.toLowerCase().startsWith(trimmed))
      : []

  return (
    <Screen>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="gap-6.5 px-5 py-10"
      >
        <View
          className={cn(
            "h-13 flex-row items-center gap-2.5 border-b",
            focused ? "border-primary" : "border-input"
          )}
        >
          <Icon
            as={MagnifyingGlassIcon}
            className="size-5 shrink-0 text-muted-foreground"
          />
          <Input
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search suiss"
            accessibilityLabel="Search suiss"
            returnKeyType="search"
            autoCorrect={false}
            className="h-12 min-w-0 flex-1 rounded-none border-transparent bg-transparent px-0 text-2xl font-semibold"
          />
          {query ? (
            <Button
              size="icon-xs"
              hitSlop={10}
              accessibilityLabel="Clear search"
              onPress={() => {
                setQuery("")
                inputRef.current?.focus()
              }}
              className="size-5.5 bg-muted-foreground active:opacity-80"
            >
              <Icon
                as={XIcon}
                weight="bold"
                className="size-2.75 text-background"
              />
            </Button>
          ) : null}
        </View>
        {matches.length > 0 ? (
          <View accessibilityLabel="Suggested" className="gap-1">
            <Text className="mb-1.5 text-xs text-muted-foreground">
              Suggested
            </Text>
            {matches.map((item) => (
              <Pressable
                key={item}
                role="button"
                onPress={() => setQuery(item)}
                className="flex-row items-center gap-2.5 rounded-md py-1.5 active:opacity-60"
              >
                <Icon
                  as={MagnifyingGlassIcon}
                  className="size-3.5 text-muted-foreground"
                />
                <Text className="text-lg">{item}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <AnimatedView
            key={query ? "none" : "idle"}
            entering={FadeInDown.duration(600).reduceMotion(
              ReduceMotion.System
            )}
          >
            <Empty className="flex-none items-start gap-3 rounded-none p-0">
              <EmptyHeader
                accessibilityLiveRegion="polite"
                className="max-w-none items-start gap-3"
              >
                <EmptyTitle className="text-start text-3xl font-semibold">
                  {query
                    ? `No results for “${query}”.`
                    : "What are you looking for?"}
                </EmptyTitle>
                <EmptyDescription className="text-start text-lg">
                  {query
                    ? "Check the spelling or try one of these:"
                    : "Search for products, support articles or stores."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="mt-1.5 max-w-none flex-row flex-wrap items-start gap-2">
                {SUGGESTIONS.map((item) => (
                  <Button
                    key={item}
                    variant="secondary"
                    onPress={() => setQuery(item)}
                    className="h-8.5 px-3.5"
                  >
                    <Text>{item}</Text>
                  </Button>
                ))}
              </EmptyContent>
            </Empty>
          </AnimatedView>
        )}
      </ScrollView>
    </Screen>
  )
}

export { EmptySearch }
