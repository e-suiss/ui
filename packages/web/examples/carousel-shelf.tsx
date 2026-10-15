import { CaretRightIcon } from "@phosphor-icons/react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPlayButton,
} from "@/components/ui/carousel"

const popular = [
  { name: "Breakfast platter", price: "₺620", tint: "from-orange to-red" },
  { name: "Grilled meatballs", price: "₺280", tint: "from-red to-pink" },
  { name: "Menemen", price: "₺160", tint: "from-yellow to-orange" },
  { name: "Lentil soup", price: "₺90", tint: "from-green to-teal" },
  { name: "Künefe", price: "₺160", tint: "from-purple to-indigo" },
]

export default function CarouselShelf() {
  return (
    <div className="w-[min(56rem,calc(100vw-2rem))]">
      <div className="max-w-md">
        <Carousel
          orientation="horizontal"
          opts={{ align: "start", dragFree: true }}
        >
          <div className="mb-3 flex items-center justify-between">
            <a
              href="#popular"
              className="flex items-center gap-1 text-xl font-bold tracking-tight"
            >
              Popular
              <CaretRightIcon weight="bold" className="size-4" />
            </a>
            <div className="flex items-center gap-3">
              <CarouselPlayButton variant="ghost" />
              <a href="#popular-all" className="text-link">
                See all
              </a>
            </div>
          </div>
          <CarouselContent className="-ms-3">
            {popular.map((item) => (
              <CarouselItem key={item.name} className="basis-2/5 ps-3">
                <div
                  className={`aspect-square rounded-2xl bg-linear-to-br ${item.tint}`}
                />
                <p className="mt-2 truncate text-sm font-semibold">
                  {item.name}
                </p>
                <p className="text-xs text-label-secondary tabular-nums">
                  {item.price}
                </p>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
