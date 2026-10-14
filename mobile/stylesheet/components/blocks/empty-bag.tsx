import { CheckIcon, HandbagIcon, PlusIcon } from "phosphor-react-native"
import * as React from "react"
import { Image, ScrollView, StyleSheet, View } from "react-native"
import { ReduceMotion, ZoomIn } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=500&q=80&auto=format&fit=crop`

const RECOMMENDED = [
  {
    name: "Pods Studio",
    price: "$549",
    image: photo("1599669454699-248893623440"),
  },
  {
    name: "Sport Band",
    price: "$49",
    image: photo("1624096104992-9b4fa3a279dd"),
  },
  {
    name: "Phone Pro Clear Case",
    price: "$49",
    image: photo("1703676311066-34caf2cbee33"),
  },
]

const styles = StyleSheet.create({
  content: { gap: 22, paddingVertical: 40 },
  empty: { flex: 0, gap: 20, paddingHorizontal: 20, paddingVertical: 0 },
  header: { maxWidth: 448, gap: 10 },
  media: { marginBottom: 4 },
  badge: {
    position: "absolute",
    end: -6,
    bottom: -2,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  badgeText: {
    ...fontSize["2xs"],
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  title: { ...fontSize["3xl"], fontWeight: "600" },
  description: { ...fontSize.lg },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
  },
  section: { marginTop: 14, gap: 16 },
  heading: { ...fontSize.lg, fontWeight: "600", paddingHorizontal: 20 },
  rail: { gap: 16, paddingHorizontal: 20 },
  card: { width: 240, gap: 10 },
  image: { aspectRatio: 1.2, width: "100%", borderRadius: radius["2xl"] },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  info: { flex: 1 },
  name: { ...fontSize.base, fontWeight: "600" },
  price: { ...fontSize.sm },
  add: { width: 30, height: 30 },
})

function EmptyBag() {
  const { colors } = useTheme()
  const [added, setAdded] = React.useState<string[]>([])
  const count = added.length

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Empty style={styles.empty}>
          <EmptyHeader style={styles.header}>
            <EmptyMedia style={styles.media}>
              <Icon as={HandbagIcon} weight="light" size={46} />
              {count > 0 ? (
                <AnimatedView
                  key={count}
                  entering={ZoomIn.duration(300).reduceMotion(
                    ReduceMotion.System
                  )}
                  style={[styles.badge, { backgroundColor: colors.label }]}
                >
                  <Text style={[styles.badgeText, { color: colors.surface }]}>
                    {count}
                  </Text>
                </AnimatedView>
              ) : null}
            </EmptyMedia>
            <EmptyTitle accessibilityLiveRegion="polite" style={styles.title}>
              {count
                ? `There ${count === 1 ? "is 1 item" : `are ${count} items`} in your bag.`
                : "Your bag is empty."}
            </EmptyTitle>
            <EmptyDescription style={styles.description}>
              {count
                ? "Check out now or keep browsing."
                : "Sign in to see items you saved."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent style={styles.actions}>
            <Button size="lg">
              <Text>{count ? "Check Out" : "Sign In"}</Text>
            </Button>
            <Button size="lg" variant="outline">
              <Text>Continue Shopping</Text>
            </Button>
          </EmptyContent>
        </Empty>
        <View style={styles.section}>
          <Text role="heading" style={styles.heading}>
            You may also like
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rail}
          >
            {RECOMMENDED.map((item) => {
              const inBag = added.includes(item.name)
              return (
                <View key={item.name} style={styles.card}>
                  <Image
                    source={{ uri: item.image }}
                    resizeMode="cover"
                    accessibilityIgnoresInvertColors
                    style={[styles.image, { backgroundColor: colors.control }]}
                  />
                  <View style={styles.row}>
                    <View style={styles.info}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text
                        style={[styles.price, { color: colors.labelSecondary }]}
                      >
                        {item.price}
                      </Text>
                    </View>
                    <Button
                      size="icon-sm"
                      hitSlop={7}
                      accessibilityState={{ selected: inBag }}
                      accessibilityLabel={
                        inBag
                          ? `Remove ${item.name} from bag`
                          : `Add ${item.name} to bag`
                      }
                      onPress={() =>
                        setAdded((current) =>
                          inBag
                            ? current.filter((name) => name !== item.name)
                            : [...current, item.name]
                        )
                      }
                      style={[
                        styles.add,
                        inBag && { backgroundColor: colors.success },
                      ]}
                    >
                      <Icon
                        as={inBag ? CheckIcon : PlusIcon}
                        weight="bold"
                        size={15}
                      />
                    </Button>
                  </View>
                </View>
              )
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  )
}

export { EmptyBag }
