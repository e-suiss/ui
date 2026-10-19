import { View } from "react-native"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Text } from "@/components/ui/text"

export default function CarouselShelf() {
  return (
    <Carousel opts={{ align: "start", dragFree: true }}>
      <Text className="mb-3 text-xl font-bold">Popular</Text>
      <CarouselContent className="-ms-3">
        <CarouselItem basis={0.4} className="ps-3">
          <View className="aspect-square rounded-2xl bg-orange-500" />
          <Text className="mt-2 text-sm font-semibold" numberOfLines={1}>
            Weekend breakfast
          </Text>
        </CarouselItem>
        <CarouselItem basis={0.4} className="ps-3">
          <View className="aspect-square rounded-2xl bg-red-500" />
          <Text className="mt-2 text-sm font-semibold" numberOfLines={1}>
            Grilled meatballs
          </Text>
        </CarouselItem>
        <CarouselItem basis={0.4} className="ps-3">
          <View className="aspect-square rounded-2xl bg-teal-500" />
          <Text className="mt-2 text-sm font-semibold" numberOfLines={1}>
            Lentil soup
          </Text>
        </CarouselItem>
        <CarouselItem basis={0.4} className="ps-3">
          <View className="aspect-square rounded-2xl bg-purple-500" />
          <Text className="mt-2 text-sm font-semibold" numberOfLines={1}>
            Künefe
          </Text>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}
