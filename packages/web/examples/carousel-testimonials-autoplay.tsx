import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPlayButton,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function CarouselTestimonialsAutoplay() {
  return (
    <div className="w-[min(56rem,calc(100vw-2rem))] max-w-md rounded-3xl bg-muted p-8">
      <Carousel orientation="horizontal" autoplay={6000} opts={{ loop: true }}>
        <CarouselContent>
          <CarouselItem>
            <figure className="flex min-h-28 flex-col gap-3">
              <blockquote className="text-2xl font-bold tracking-tight">
                “The checkout line is half as long.”
              </blockquote>
              <figcaption className="text-muted-foreground">
                Ayşe Y. · Kadıköy
              </figcaption>
            </figure>
          </CarouselItem>
          <CarouselItem>
            <figure className="flex min-h-28 flex-col gap-3">
              <blockquote className="text-2xl font-bold tracking-tight">
                “The kitchen finally keeps up on Fridays.”
              </blockquote>
              <figcaption className="text-muted-foreground">
                Mert K. · Beşiktaş
              </figcaption>
            </figure>
          </CarouselItem>
          <CarouselItem>
            <figure className="flex min-h-28 flex-col gap-3">
              <blockquote className="text-2xl font-bold tracking-tight">
                “Splitting the bill takes seconds now.”
              </blockquote>
              <figcaption className="text-muted-foreground">
                Deniz A. · Moda
              </figcaption>
            </figure>
          </CarouselItem>
        </CarouselContent>
        <CarouselControls className="justify-between">
          <div className="flex items-center gap-2">
            <CarouselPlayButton variant="ghost" />
            <CarouselDots variant="plain" />
          </div>
          <div className="flex gap-3">
            <CarouselPrevious size="icon-lg" />
            <CarouselNext size="icon-lg" />
          </div>
        </CarouselControls>
      </Carousel>
    </div>
  )
}
