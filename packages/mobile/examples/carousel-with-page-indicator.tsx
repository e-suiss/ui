import { View } from "react-native"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel"
import { PageIndicator } from "@/components/ui/page-indicator"
import { Text } from "@/components/ui/text"

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

export default function CarouselWithPageIndicator() {
  return (
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
  )
}
