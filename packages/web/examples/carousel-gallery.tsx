import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function CarouselGallery() {
  return (
    <Carousel
      className="w-[min(56rem,calc(100vw-2rem))]"
      orientation="horizontal"
      opts={{ align: "start" }}
    >
      <CarouselContent>
        <CarouselItem className="basis-4/5 sm:basis-2/5">
          <div className="relative isolate flex aspect-3/4 flex-col gap-2 overflow-hidden rounded-3xl bg-linear-to-b p-7 text-white before:absolute before:inset-0 before:-z-10 before:bg-black/35 from-blue-500 to-indigo-500">
            <p className="text-sm font-semibold">Point of sale</p>
            <p className="text-2xl font-semibold">Take orders at the table.</p>
          </div>
        </CarouselItem>
        <CarouselItem className="basis-4/5 sm:basis-2/5">
          <div className="relative isolate flex aspect-3/4 flex-col gap-2 overflow-hidden rounded-3xl bg-linear-to-b p-7 text-white before:absolute before:inset-0 before:-z-10 before:bg-black/35 from-orange-500 to-red-500">
            <p className="text-sm font-semibold">Kitchen</p>
            <p className="text-2xl font-semibold">
              Every ticket, right on time.
            </p>
          </div>
        </CarouselItem>
        <CarouselItem className="basis-4/5 sm:basis-2/5">
          <div className="relative isolate flex aspect-3/4 flex-col gap-2 overflow-hidden rounded-3xl bg-linear-to-b p-7 text-white before:absolute before:inset-0 before:-z-10 before:bg-black/35 from-green-500 to-teal-500">
            <p className="text-sm font-semibold">Reservations</p>
            <p className="text-2xl font-semibold">A full room, every night.</p>
          </div>
        </CarouselItem>
        <CarouselItem className="basis-4/5 sm:basis-2/5">
          <div className="relative isolate flex aspect-3/4 flex-col gap-2 overflow-hidden rounded-3xl bg-linear-to-b p-7 text-white before:absolute before:inset-0 before:-z-10 before:bg-black/35 from-purple-500 to-pink-500">
            <p className="text-sm font-semibold">Analytics</p>
            <p className="text-2xl font-semibold">Know what sells.</p>
          </div>
        </CarouselItem>
        <CarouselItem className="basis-4/5 sm:basis-2/5">
          <div className="relative isolate flex aspect-3/4 flex-col gap-2 overflow-hidden rounded-3xl bg-linear-to-b p-7 text-white before:absolute before:inset-0 before:-z-10 before:bg-black/35 from-cyan-500 to-blue-500">
            <p className="text-sm font-semibold">Payments</p>
            <p className="text-2xl font-semibold">Split the bill in seconds.</p>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselControls className="justify-end">
        <CarouselPrevious />
        <CarouselNext />
      </CarouselControls>
    </Carousel>
  )
}
