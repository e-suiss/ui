import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Text } from "@/components/ui/text"

export default function CarouselLoop() {
  return (
    <Carousel opts={{ loop: true }} className="mx-12">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((slide) => (
          <CarouselItem key={slide}>
            <Card>
              <CardContent className="aspect-square items-center justify-center">
                <Text className="text-4xl font-semibold">{slide}</Text>
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
