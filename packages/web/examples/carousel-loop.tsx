import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [1, 2, 3, 4, 5]

export default function CarouselLoop() {
  return (
    <Carousel
      className="mx-12 w-72 min-w-0"
      orientation="horizontal"
      opts={{ loop: true }}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center">
                  <span className="text-4xl font-semibold">{slide}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
