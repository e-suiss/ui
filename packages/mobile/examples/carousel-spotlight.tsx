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

const features = [
  { title: "Take orders at the table." },
  { title: "Every ticket, right on time." },
  { title: "A full room, every night." },
]

export default function CarouselSpotlight() {
  return (
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
  )
}
