import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Text } from "@/components/ui/text"

export default function CarouselVertical() {
  return (
    <Carousel
      orientation="vertical"
      opts={{ align: "start" }}
      className="my-12"
    >
      <CarouselContent className="h-64">
        {[1, 2, 3, 4, 5].map((slide) => (
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
  )
}
