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

const features = [
  {
    eyebrow: "Point of sale",
    title: "Take orders at the table.",
    tint: "from-blue-500 to-indigo-500",
  },
  {
    eyebrow: "Kitchen",
    title: "Every ticket, right on time.",
    tint: "from-orange-500 to-red-500",
  },
  {
    eyebrow: "Reservations",
    title: "A full room, every night.",
    tint: "from-green-500 to-teal-500",
  },
  {
    eyebrow: "Analytics",
    title: "Know what sells.",
    tint: "from-purple-500 to-pink-500",
  },
  {
    eyebrow: "Payments",
    title: "Split the bill in seconds.",
    tint: "from-cyan-500 to-blue-500",
  },
]

export default function CarouselSpotlightAutoplay() {
  return (
    <div className="w-[min(56rem,calc(100vw-2rem))]">
      <div className="max-w-md">
        <Carousel orientation="horizontal" opts={{ loop: true }} autoplay>
          <CarouselContent>
            {features.slice(0, 3).map((feature) => (
              <CarouselItem key={feature.title}>
                <div className="flex aspect-10/7 flex-col items-center justify-center gap-3 rounded-3xl bg-muted p-8 text-center">
                  <p className="text-3xl font-bold tracking-tight">
                    Hestia POS
                  </p>
                  <p className="text-muted-foreground">{feature.title}</p>
                  <Button
                    size="sm"
                    className="mt-2 bg-foreground text-background hover:bg-foreground/85"
                  >
                    Learn more
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls className="justify-center">
            <CarouselDots />
            <CarouselPlayButton />
            {!true && <CarouselNext size="icon-sm" />}
          </CarouselControls>
        </Carousel>
      </div>
    </div>
  )
}
