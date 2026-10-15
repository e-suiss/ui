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

const quotes = [
  { quote: "The checkout line is half as long.", author: "Ayşe Y. · Kadıköy" },
  {
    quote: "The kitchen finally keeps up on Fridays.",
    author: "Mert K. · Beşiktaş",
  },
  { quote: "Splitting the bill takes seconds now.", author: "Deniz A. · Moda" },
]

export default function CarouselTestimonialsAutoplay() {
  return (
    <div className="w-[min(56rem,calc(100vw-2rem))]">
      <div className="max-w-md rounded-3xl bg-muted p-8">
        <Carousel
          orientation="horizontal"
          autoplay={6000}
          opts={{ loop: true }}
        >
          <CarouselContent>
            {quotes.map((item) => (
              <CarouselItem key={item.quote}>
                <blockquote className="flex min-h-28 flex-col gap-3">
                  <p className="text-2xl font-bold tracking-tight">
                    “{item.quote}”
                  </p>
                  <footer className="text-muted-foreground">
                    {item.author}
                  </footer>
                </blockquote>
              </CarouselItem>
            ))}
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
    </div>
  )
}
