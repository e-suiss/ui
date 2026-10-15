import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPlayButton,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel"
import { PageIndicator } from "@/components/ui/page-indicator"
import { Text } from "@/components/ui/text"

const slides = [1, 2, 3, 4, 5]

const picks = [
  {
    eyebrow: "Today's pick",
    title: "Weekend breakfast",
    tint: "bg-orange-500",
  },
  { eyebrow: "New", title: "Grilled meatballs", tint: "bg-red-500" },
  { eyebrow: "Chef's special", title: "Lentil soup", tint: "bg-teal-500" },
  { eyebrow: "Dessert", title: "Künefe", tint: "bg-purple-500" },
]

const features = [
  { title: "Take orders at the table." },
  { title: "Every ticket, right on time." },
  { title: "A full room, every night." },
]

function NumberSlides({ basis }: { basis?: number }) {
  return (
    <CarouselContent>
      {slides.map((slide) => (
        <CarouselItem key={slide} basis={basis}>
          <Card size={basis ? "sm" : "default"}>
            <CardContent className="aspect-square items-center justify-center">
              <Text className="text-4xl font-semibold">{slide}</Text>
            </CardContent>
          </Card>
        </CarouselItem>
      ))}
    </CarouselContent>
  )
}

function CarouselPageIndicator() {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel()
  return (
    <PageIndicator
      className="mt-4"
      count={scrollSnaps.length}
      index={selectedIndex}
      onIndexChange={(index) => scrollTo(index)}
    />
  )
}

const meta = {
  title: "Components/Carousel",
  component: Carousel,
} satisfies Meta<typeof Carousel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="mx-12">
      <Carousel>
        <NumberSlides />
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </View>
  ),
}

export const MultipleItems: Story = {
  render: () => (
    <View className="mx-12">
      <Carousel opts={{ align: "start" }}>
        <NumberSlides basis={0.5} />
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </View>
  ),
}

export const Loop: Story = {
  render: () => (
    <View className="mx-12">
      <Carousel opts={{ loop: true }}>
        <NumberSlides />
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </View>
  ),
}

export const Vertical: Story = {
  render: () => (
    <View className="my-12">
      <Carousel orientation="vertical" opts={{ align: "start" }}>
        <CarouselContent className="h-64">
          {slides.map((slide) => (
            <CarouselItem key={slide} basis={0.5}>
              <Card size="sm" className="h-full justify-center">
                <CardContent className="items-center justify-center">
                  <Text className="text-3xl font-semibold">{slide}</Text>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </View>
  ),
}

export const WithPageIndicator: Story = {
  render: () => (
    <Carousel>
      <CarouselContent>
        {picks.map((pick) => (
          <CarouselItem key={pick.title}>
            <View
              className={`aspect-[4/5] justify-end gap-1 rounded-3xl p-5 ${pick.tint}`}
            >
              <Text className="text-xs font-semibold text-primary-foreground uppercase">
                {pick.eyebrow}
              </Text>
              <Text className="text-2xl font-bold text-primary-foreground">
                {pick.title}
              </Text>
            </View>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPageIndicator />
    </Carousel>
  ),
}

export const Featured: Story = {
  render: () => (
    <Carousel opts={{ align: "start" }}>
      <CarouselContent>
        {picks.map((pick) => (
          <CarouselItem key={pick.title} basis={0.88}>
            <View
              className={`aspect-[4/5] justify-end gap-1 rounded-3xl p-5 ${pick.tint}`}
            >
              <Text className="text-xs font-semibold text-primary-foreground uppercase">
                {pick.eyebrow}
              </Text>
              <Text className="text-2xl font-bold text-primary-foreground">
                {pick.title}
              </Text>
            </View>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselControls className="mt-4 justify-center">
        <CarouselDots variant="plain" />
        <CarouselPlayButton variant="ghost" />
      </CarouselControls>
    </Carousel>
  ),
}

export const Spotlight: Story = {
  render: () => (
    <Carousel opts={{ loop: true }}>
      <CarouselContent>
        {features.map((feature) => (
          <CarouselItem key={feature.title}>
            <View className="aspect-[10/7] items-center justify-center gap-3 rounded-3xl bg-muted p-8">
              <Text className="text-3xl font-bold">Hestia POS</Text>
              <Text className="text-center text-muted-foreground">
                {feature.title}
              </Text>
            </View>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselControls className="justify-center">
        <CarouselDots />
        <CarouselNext size="icon-sm" />
      </CarouselControls>
    </Carousel>
  ),
}

export const Autoplay: Story = {
  render: () => (
    <Carousel autoplay={4000} opts={{ loop: true }}>
      <CarouselContent>
        {features.map((feature) => (
          <CarouselItem key={feature.title}>
            <View className="aspect-[10/7] items-center justify-center gap-3 rounded-3xl bg-muted p-8">
              <Text className="text-3xl font-bold">Hestia POS</Text>
              <Text className="text-center text-muted-foreground">
                {feature.title}
              </Text>
            </View>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselControls className="justify-center">
        <CarouselDots />
        <CarouselPlayButton />
      </CarouselControls>
    </Carousel>
  ),
}

export const Shelf: Story = {
  render: () => (
    <Carousel opts={{ align: "start", dragFree: true }}>
      <Text className="mb-3 text-xl font-bold">Popular</Text>
      <CarouselContent className="-ms-3">
        {picks.map((pick) => (
          <CarouselItem key={pick.title} basis={0.4} className="ps-3">
            <View className={`aspect-square rounded-2xl ${pick.tint}`} />
            <Text className="mt-2 text-sm font-semibold" numberOfLines={1}>
              {pick.title}
            </Text>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
}
