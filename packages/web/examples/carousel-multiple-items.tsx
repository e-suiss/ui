import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [1, 2, 3, 4, 5]

export default function CarouselMultipleItems() {
  return (
    <Carousel
      className="mx-12 w-72 min-w-0"
      orientation="horizontal"
      opts={{ align: "start" }}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide} className="basis-1/2">
            <div className="p-1">
              <Card size="sm">
                <CardContent className="flex aspect-square items-center justify-center">
                  <span className="text-3xl font-semibold">{slide}</span>
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
