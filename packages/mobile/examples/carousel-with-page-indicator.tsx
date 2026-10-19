import { View } from "react-native"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel"
import { PageIndicator } from "@/components/ui/page-indicator"
import { Text } from "@/components/ui/text"

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
        <CarouselItem>
          <View className="aspect-[4/5] justify-end gap-1 rounded-3xl p-5 bg-orange-500">
            <Text className="text-xs font-semibold text-primary-foreground uppercase">
              Today's pick
            </Text>
            <Text className="text-2xl font-bold text-primary-foreground">
              Weekend breakfast
            </Text>
          </View>
        </CarouselItem>
        <CarouselItem>
          <View className="aspect-[4/5] justify-end gap-1 rounded-3xl p-5 bg-red-500">
            <Text className="text-xs font-semibold text-primary-foreground uppercase">
              New
            </Text>
            <Text className="text-2xl font-bold text-primary-foreground">
              Grilled meatballs
            </Text>
          </View>
        </CarouselItem>
        <CarouselItem>
          <View className="aspect-[4/5] justify-end gap-1 rounded-3xl p-5 bg-teal-500">
            <Text className="text-xs font-semibold text-primary-foreground uppercase">
              Chef's special
            </Text>
            <Text className="text-2xl font-bold text-primary-foreground">
              Lentil soup
            </Text>
          </View>
        </CarouselItem>
        <CarouselItem>
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
      <CarouselPageIndicator />
    </Carousel>
  )
}
