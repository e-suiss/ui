import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselPlayButton,
} from "@/components/ui/carousel"

export default function CarouselFeaturedAutoplay() {
  return (
    <Carousel
      className="w-[min(56rem,calc(100vw-2rem))] max-w-sm"
      orientation="horizontal"
      opts={{ align: "start", loop: true }}
      autoplay={4000}
    >
      <CarouselContent>
        <CarouselItem className="basis-[88%]">
          <div className="relative isolate flex aspect-4/5 flex-col gap-1 overflow-hidden rounded-3xl bg-linear-to-br p-5 text-white before:absolute before:inset-0 before:-z-10 before:bg-linear-to-b before:from-black/45 before:to-black/10 from-orange-500 to-red-500">
            <p className="text-xs font-semibold uppercase">Today's pick</p>
            <p className="text-2xl font-bold tracking-tight">
              Weekend breakfast
            </p>
          </div>
        </CarouselItem>
        <CarouselItem className="basis-[88%]">
          <div className="relative isolate flex aspect-4/5 flex-col gap-1 overflow-hidden rounded-3xl bg-linear-to-br p-5 text-white before:absolute before:inset-0 before:-z-10 before:bg-linear-to-b before:from-black/45 before:to-black/10 from-red-500 to-pink-500">
            <p className="text-xs font-semibold uppercase">New</p>
            <p className="text-2xl font-bold tracking-tight">
              Grilled meatballs
            </p>
          </div>
        </CarouselItem>
        <CarouselItem className="basis-[88%]">
          <div className="relative isolate flex aspect-4/5 flex-col gap-1 overflow-hidden rounded-3xl bg-linear-to-br p-5 text-white before:absolute before:inset-0 before:-z-10 before:bg-linear-to-b before:from-black/45 before:to-black/10 from-green-500 to-teal-500">
            <p className="text-xs font-semibold uppercase">Chef's special</p>
            <p className="text-2xl font-bold tracking-tight">Lentil soup</p>
          </div>
        </CarouselItem>
        <CarouselItem className="basis-[88%]">
          <div className="relative isolate flex aspect-4/5 flex-col gap-1 overflow-hidden rounded-3xl bg-linear-to-br p-5 text-white before:absolute before:inset-0 before:-z-10 before:bg-linear-to-b before:from-black/45 before:to-black/10 from-purple-500 to-indigo-500">
            <p className="text-xs font-semibold uppercase">Dessert</p>
            <p className="text-2xl font-bold tracking-tight">Künefe</p>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselControls className="mt-4 justify-center">
        <CarouselDots variant="plain" />
        <CarouselPlayButton variant="ghost" />
      </CarouselControls>
    </Carousel>
  )
}
