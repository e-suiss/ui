import { View } from "react-native"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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

export default function CarouselShelf() {
  return (
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
  )
}
