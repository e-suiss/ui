import { View } from "react-native"
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselPlayButton,
} from "@/components/ui/carousel"
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

export default function CarouselFeatured() {
  return (
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
  )
}
