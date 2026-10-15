import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPlayButton,
} from "@/components/ui/carousel"

const popular = [
  {
    name: "Breakfast platter",
    price: "₺620",
    tint: "from-orange-500 to-red-500",
  },
  {
    name: "Grilled meatballs",
    price: "₺280",
    tint: "from-red-500 to-pink-500",
  },
  { name: "Menemen", price: "₺160", tint: "from-yellow-500 to-orange-500" },
  { name: "Lentil soup", price: "₺90", tint: "from-green-500 to-teal-500" },
  { name: "Künefe", price: "₺160", tint: "from-purple-500 to-indigo-500" },
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
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                className="size-4"
              />
            </a>
            <div className="flex items-center gap-3">
              <CarouselPlayButton variant="ghost" />
              <a href="#popular-all" className="text-primary">
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
                <p className="text-xs text-muted-foreground tabular-nums">
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
