import { cn } from "cn"
import {
  BellRingingIcon,
  CloudIcon,
  type Icon as PhosphorIcon,
  ShieldCheckIcon,
  SparkleIcon,
} from "phosphor-react-native"
import type * as React from "react"
import { View } from "react-native"
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

type OnboardingPage = {
  title: string
  description: string
  illustration?: React.ReactNode
}

function Illustration({ icon }: { icon: PhosphorIcon }) {
  return (
    <View className="size-40 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
      <Icon as={icon} weight="duotone" className="size-20 text-primary" />
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
        className="mb-2"
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
          className={cn(last && "opacity-0")}
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
  return (
    <Screen>
      <Carousel className="flex-1">
        <View className="flex-1 justify-center">
          <CarouselContent>
            {pages.map((page) => (
              <CarouselItem key={page.title}>
                <View className="items-center gap-4 px-8 py-6">
                  {page.illustration ? (
                    <View
                      accessible={false}
                      importantForAccessibility="no-hide-descendants"
                      className="mb-6"
                    >
                      {page.illustration}
                    </View>
                  ) : null}
                  <Text
                    role="heading"
                    className="text-center text-3xl font-bold"
                  >
                    {page.title}
                  </Text>
                  <Text className="text-center text-lg text-muted-foreground">
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
