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

export default function CarouselMultipleItems() {
  return (
    <View className="mx-12">
      <Carousel opts={{ align: "start" }}>
        <NumberSlides basis={0.5} />
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </View>
  )
}
