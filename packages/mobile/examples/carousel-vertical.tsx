import { View } from "react-native"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Text } from "@/components/ui/text"

const slides = [1, 2, 3, 4, 5]

export default function CarouselVertical() {
  return (
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
  )
}
