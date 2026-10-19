import { View } from "react-native"
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel"
import { Text } from "@/components/ui/text"

export default function CarouselSpotlight() {
  return (
    <Carousel opts={{ loop: true }}>
      <CarouselContent>
        <CarouselItem>
          <View className="aspect-[10/7] items-center justify-center gap-3 rounded-3xl bg-muted p-8">
            <Text className="text-3xl font-bold">Hestia POS</Text>
            <Text className="text-center text-muted-foreground">
              Take orders at the table.
            </Text>
          </View>
        </CarouselItem>
        <CarouselItem>
          <View className="aspect-[10/7] items-center justify-center gap-3 rounded-3xl bg-muted p-8">
            <Text className="text-3xl font-bold">Hestia POS</Text>
            <Text className="text-center text-muted-foreground">
              Every ticket, right on time.
            </Text>
          </View>
        </CarouselItem>
        <CarouselItem>
          <View className="aspect-[10/7] items-center justify-center gap-3 rounded-3xl bg-muted p-8">
            <Text className="text-3xl font-bold">Hestia POS</Text>
            <Text className="text-center text-muted-foreground">
              A full room, every night.
            </Text>
          </View>
        </CarouselItem>
      </CarouselContent>
      <CarouselControls className="justify-center">
        <CarouselDots />
        <CarouselNext size="icon-sm" />
      </CarouselControls>
    </Carousel>
  )
}
