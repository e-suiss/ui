import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [1, 2, 3, 4, 5]

export default function CarouselVertical() {
  return (
    <Carousel
      className="m-12 w-72 min-w-0"
      orientation="vertical"
      opts={{ align: "start" }}
    >
      <CarouselContent className="h-64">
        {slides.map((slide) => (
          <CarouselItem key={slide} className="basis-1/2">
            <div className="h-full p-1">
              <Card size="sm" className="h-full justify-center">
                <CardContent className="flex items-center justify-center">
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
