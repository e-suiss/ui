import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const features = [
  {
    eyebrow: "Point of sale",
    title: "Take orders at the table.",
    tint: "from-blue to-indigo",
  },
  {
    eyebrow: "Kitchen",
    title: "Every ticket, right on time.",
    tint: "from-orange to-red",
  },
  {
    eyebrow: "Reservations",
    title: "A full room, every night.",
    tint: "from-green to-teal",
  },
  {
    eyebrow: "Analytics",
    title: "Know what sells.",
    tint: "from-purple to-pink",
  },
  {
    eyebrow: "Payments",
    title: "Split the bill in seconds.",
    tint: "from-cyan to-blue",
  },
]

export default function CarouselGallery() {
  return (
    <div className="w-[min(56rem,calc(100vw-2rem))]">
      <Carousel orientation="horizontal" opts={{ align: "start" }}>
        <CarouselContent>
          {features.map((feature) => (
            <CarouselItem
              key={feature.title}
              className="basis-4/5 sm:basis-2/5"
            >
              <div
                className={`relative isolate flex aspect-3/4 flex-col gap-2 overflow-hidden rounded-3xl bg-linear-to-b p-7 text-white before:absolute before:inset-0 before:-z-10 before:bg-black/35 ${feature.tint}`}
              >
                <p className="text-sm font-semibold">{feature.eyebrow}</p>
                <p className="text-2xl font-semibold">{feature.title}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselControls className="justify-end">
          <CarouselPrevious />
          <CarouselNext />
        </CarouselControls>
      </Carousel>
    </div>
  )
}
