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

export default function CarouselFeatured() {
  return (
    <Carousel opts={{ align: "start" }}>
      <CarouselContent>
        <CarouselItem basis={0.88}>
          <View className="aspect-[4/5] justify-end gap-1 rounded-3xl p-5 bg-orange-500">
            <Text className="text-xs font-semibold text-primary-foreground uppercase">
              Today's pick
            </Text>
            <Text className="text-2xl font-bold text-primary-foreground">
              Weekend breakfast
            </Text>
          </View>
        </CarouselItem>
        <CarouselItem basis={0.88}>
          <View className="aspect-[4/5] justify-end gap-1 rounded-3xl p-5 bg-red-500">
            <Text className="text-xs font-semibold text-primary-foreground uppercase">
              New
            </Text>
            <Text className="text-2xl font-bold text-primary-foreground">
              Grilled meatballs
            </Text>
          </View>
        </CarouselItem>
        <CarouselItem basis={0.88}>
          <View className="aspect-[4/5] justify-end gap-1 rounded-3xl p-5 bg-teal-500">
            <Text className="text-xs font-semibold text-primary-foreground uppercase">
              Chef's special
            </Text>
            <Text className="text-2xl font-bold text-primary-foreground">
              Lentil soup
            </Text>
          </View>
        </CarouselItem>
        <CarouselItem basis={0.88}>
          <View className="aspect-[4/5] justify-end gap-1 rounded-3xl p-5 bg-purple-500">
            <Text className="text-xs font-semibold text-primary-foreground uppercase">
              Dessert
            </Text>
            <Text className="text-2xl font-bold text-primary-foreground">
              Künefe
            </Text>
          </View>
        </CarouselItem>
      </CarouselContent>
      <CarouselControls className="mt-4 justify-center">
        <CarouselDots variant="plain" />
        <CarouselPlayButton variant="ghost" />
      </CarouselControls>
    </Carousel>
  )
}
