import { MagnifyingGlassIcon, XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Pressable,
  ScrollView,
  StyleSheet,
  type TextInput,
  View,
} from "react-native"
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
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const SUGGESTIONS = ["Book Air", "Book Pro", "Book mini", "Compare Book models"]

const styles = StyleSheet.create({
  content: { gap: 26, paddingHorizontal: 20, paddingVertical: 40 },
  field: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
  },
  input: {
    ...fontSize["2xl"],
    height: 48,
    minWidth: 0,
    flex: 1,
    borderRadius: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    fontWeight: "600",
  },
  clear: { width: 22, height: 22 },
  suggested: { gap: 4 },
  suggestedLabel: { ...fontSize.xs, marginBottom: 6 },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: radius.md,
    paddingVertical: 6,
  },
  suggestionText: { ...fontSize.lg },
  empty: {
    flex: 0,
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 0,
    padding: 0,
  },
  header: { maxWidth: "100%", alignItems: "flex-start", gap: 12 },
  title: { ...fontSize["3xl"], fontWeight: "600", textAlign: "left" },
  description: { ...fontSize.lg, textAlign: "left" },
  chips: {
    marginTop: 6,
    maxWidth: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 8,
  },
  chip: { height: 34, paddingHorizontal: 14 },
})

function EmptySearch() {
  const { colors } = useTheme()
  const [query, setQuery] = React.useState("book neo")
  const [focused, setFocused] = React.useState(false)
  const inputRef = React.useRef<TextInput>(null)
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
        contentContainerStyle={styles.content}
      >
        <View
          style={[
            styles.field,
            {
              borderBottomColor: focused
                ? colors.accent
                : colors.separatorStrong,
            },
          ]}
        >
          <Icon
            as={MagnifyingGlassIcon}
            size={20}
            color={colors.labelSecondary}
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
            style={styles.input}
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
              style={({ pressed }) => [
                styles.clear,
                {
                  backgroundColor: pressed
                    ? colors.labelSecondary
                    : colors.labelTertiary,
                },
              ]}
            >
              <Icon as={XIcon} weight="bold" size={11} color={colors.surface} />
            </Button>
          ) : null}
        </View>
        {matches.length > 0 ? (
          <View accessibilityLabel="Suggested" style={styles.suggested}>
            <Text
              style={[styles.suggestedLabel, { color: colors.labelSecondary }]}
            >
              Suggested
            </Text>
            {matches.map((item) => (
              <Pressable
                key={item}
                role="button"
                onPress={() => setQuery(item)}
                style={({ pressed }) => [
                  styles.suggestion,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Icon
                  as={MagnifyingGlassIcon}
                  size={14}
                  color={colors.labelTertiary}
                />
                <Text style={styles.suggestionText}>{item}</Text>
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
            <Empty style={styles.empty}>
              <EmptyHeader
                accessibilityLiveRegion="polite"
                style={styles.header}
              >
                <EmptyTitle style={styles.title}>
                  {query
                    ? `No results for “${query}”.`
                    : "What are you looking for?"}
                </EmptyTitle>
                <EmptyDescription style={styles.description}>
                  {query
                    ? "Check the spelling or try one of these:"
                    : "Search for products, support articles or stores."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent style={styles.chips}>
                {SUGGESTIONS.map((item) => (
                  <Button
                    key={item}
                    variant="secondary"
                    onPress={() => setQuery(item)}
                    style={styles.chip}
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
