import {
  BellRingingIcon,
  CloudIcon,
  type Icon as PhosphorIcon,
  ShieldCheckIcon,
  SparkleIcon,
} from "phosphor-react-native"
import type * as React from "react"
import { StyleSheet, View } from "react-native"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel"
import { Icon } from "@/components/ui/icon"
import { PageIndicator } from "@/components/ui/page-indicator"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type OnboardingPage = {
  title: string
  description: string
  illustration?: React.ReactNode
}

const styles = StyleSheet.create({
  illustration: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  carousel: { flex: 1 },
  stage: { flex: 1, justifyContent: "center" },
  page: {
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  art: { marginBottom: 24 },
  title: { ...fontSize["3xl"], fontWeight: "700", textAlign: "center" },
  description: { ...fontSize.lg, textAlign: "center" },
  indicator: { marginBottom: 8 },
  hidden: { opacity: 0 },
})

function Illustration({ icon }: { icon: PhosphorIcon }) {
  const { colors } = useTheme()
  return (
    <View
      style={[styles.illustration, { backgroundColor: colors.accentSurface }]}
    >
      <Icon as={icon} weight="duotone" size={80} color={colors.accent} />
    </View>
  )
}

const DEFAULT_PAGES: OnboardingPage[] = [
  {
    title: "Welcome to suiss",
    description: "Everything you need, together in one place.",
    illustration: <Illustration icon={SparkleIcon} />,
  },
  {
    title: "Always in sync",
    description:
      "Your photos, files and passwords stay up to date on every device.",
    illustration: <Illustration icon={CloudIcon} />,
  },
  {
    title: "Private by design",
    description: "Your data is end-to-end encrypted. Only you can read it.",
    illustration: <Illustration icon={ShieldCheckIcon} />,
  },
  {
    title: "Never miss a thing",
    description: "Choose what matters and we'll let you know when it happens.",
    illustration: <Illustration icon={BellRingingIcon} />,
  },
]

function OnboardingFooter({
  count,
  onDone,
}: {
  count: number
  onDone?: () => void
}) {
  const { selectedIndex, scrollNext, scrollTo } = useCarousel()
  const last = selectedIndex >= count - 1

  return (
    <BottomBar>
      <PageIndicator
        count={count}
        index={selectedIndex}
        onIndexChange={(index) => scrollTo(index)}
        style={styles.indicator}
      />
      <BottomBarContent>
        <Button
          size="lg"
          block
          onPress={() => (last ? onDone?.() : scrollNext())}
        >
          <Text>{last ? "Get started" : "Continue"}</Text>
        </Button>
        <Button
          size="lg"
          variant="plain"
          block
          disabled={last}
          accessibilityElementsHidden={last}
          importantForAccessibility={last ? "no-hide-descendants" : "auto"}
          onPress={onDone}
          style={last ? styles.hidden : undefined}
        >
          <Text>Skip</Text>
        </Button>
      </BottomBarContent>
    </BottomBar>
  )
}

function Onboarding({
  pages = DEFAULT_PAGES,
  onDone,
}: {
  pages?: OnboardingPage[]
  onDone?: () => void
}) {
  const { colors } = useTheme()
  return (
    <Screen>
      <Carousel style={styles.carousel}>
        <View style={styles.stage}>
          <CarouselContent>
            {pages.map((page) => (
              <CarouselItem key={page.title}>
                <View style={styles.page}>
                  {page.illustration ? (
                    <View
                      accessible={false}
                      importantForAccessibility="no-hide-descendants"
                      style={styles.art}
                    >
                      {page.illustration}
                    </View>
                  ) : null}
                  <Text role="heading" style={styles.title}>
                    {page.title}
                  </Text>
                  <Text
                    style={[
                      styles.description,
                      { color: colors.labelSecondary },
                    ]}
                  >
                    {page.description}
                  </Text>
                </View>
              </CarouselItem>
            ))}
          </CarouselContent>
        </View>
        <OnboardingFooter count={pages.length} onDone={onDone} />
      </Carousel>
    </Screen>
  )
}

export type { OnboardingPage }
export { Onboarding }
