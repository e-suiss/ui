import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPlayButton,
} from "@/components/ui/carousel"

export default function CarouselSpotlight() {
  return (
    <Carousel
      className="w-[min(56rem,calc(100vw-2rem))] max-w-md"
      orientation="horizontal"
      opts={{ loop: true }}
    >
      <CarouselContent>
        <CarouselItem>
          <div className="flex aspect-10/7 flex-col items-center justify-center gap-3 rounded-3xl bg-muted p-8 text-center">
            <p className="text-3xl font-bold tracking-tight">Hestia POS</p>
            <p className="text-muted-foreground">Take orders at the table.</p>
            <Button
              size="sm"
              className="mt-2 bg-foreground text-background hover:bg-foreground/85"
            >
              Learn more
            </Button>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex aspect-10/7 flex-col items-center justify-center gap-3 rounded-3xl bg-muted p-8 text-center">
            <p className="text-3xl font-bold tracking-tight">Hestia POS</p>
            <p className="text-muted-foreground">
              Every ticket, right on time.
            </p>
            <Button
              size="sm"
              className="mt-2 bg-foreground text-background hover:bg-foreground/85"
            >
              Learn more
            </Button>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex aspect-10/7 flex-col items-center justify-center gap-3 rounded-3xl bg-muted p-8 text-center">
            <p className="text-3xl font-bold tracking-tight">Hestia POS</p>
            <p className="text-muted-foreground">A full room, every night.</p>
            <Button
              size="sm"
              className="mt-2 bg-foreground text-background hover:bg-foreground/85"
            >
              Learn more
            </Button>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselControls className="justify-center">
        <CarouselDots />
        <CarouselPlayButton />
        <CarouselNext size="icon-sm" />
      </CarouselControls>
    </Carousel>
  )
}
