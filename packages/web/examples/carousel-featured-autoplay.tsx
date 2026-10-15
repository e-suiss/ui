import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselPlayButton,
} from "@/components/ui/carousel"

const picks = [
  {
    eyebrow: "Today's pick",
    title: "Weekend breakfast",
    tint: "from-orange-500 to-red-500",
  },
  {
    eyebrow: "New",
    title: "Grilled meatballs",
    tint: "from-red-500 to-pink-500",
  },
  {
    eyebrow: "Chef's special",
    title: "Lentil soup",
    tint: "from-green-500 to-teal-500",
  },
  {
    eyebrow: "Dessert",
    title: "Künefe",
    tint: "from-purple-500 to-indigo-500",
  },
]

export default function CarouselFeaturedAutoplay() {
  return (
    <div className="w-[min(56rem,calc(100vw-2rem))]">
      <div className="max-w-sm">
        <Carousel
          orientation="horizontal"
          opts={{ align: "start", loop: true }}
          autoplay={4000}
        >
          <CarouselContent>
            {picks.map((pick) => (
              <CarouselItem key={pick.title} className="basis-[88%]">
                <div
                  className={`relative isolate flex aspect-4/5 flex-col gap-1 overflow-hidden rounded-3xl bg-linear-to-br p-5 text-white before:absolute before:inset-0 before:-z-10 before:bg-linear-to-b before:from-black/45 before:to-black/10 ${pick.tint}`}
                >
                  <p className="text-xs font-semibold uppercase">
                    {pick.eyebrow}
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {pick.title}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls className="mt-4 justify-center">
            <CarouselDots variant="plain" />
            <CarouselPlayButton variant="ghost" />
          </CarouselControls>
        </Carousel>
      </div>
    </div>
  )
}
