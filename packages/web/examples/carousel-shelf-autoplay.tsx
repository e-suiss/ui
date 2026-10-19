import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPlayButton,
} from "@/components/ui/carousel"

export default function CarouselShelfAutoplay() {
  return (
    <Carousel
      className="w-[min(56rem,calc(100vw-2rem))] max-w-md"
      orientation="horizontal"
      autoplay={3000}
      opts={{ align: "start", loop: true }}
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
        <CarouselItem className="basis-2/5 ps-3">
          <div className="aspect-square rounded-2xl bg-linear-to-br from-orange-500 to-red-500" />
          <p className="mt-2 truncate text-sm font-semibold">
            Breakfast platter
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">₺620</p>
        </CarouselItem>
        <CarouselItem className="basis-2/5 ps-3">
          <div className="aspect-square rounded-2xl bg-linear-to-br from-red-500 to-pink-500" />
          <p className="mt-2 truncate text-sm font-semibold">
            Grilled meatballs
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">₺280</p>
        </CarouselItem>
        <CarouselItem className="basis-2/5 ps-3">
          <div className="aspect-square rounded-2xl bg-linear-to-br from-yellow-500 to-orange-500" />
          <p className="mt-2 truncate text-sm font-semibold">Menemen</p>
          <p className="text-xs text-muted-foreground tabular-nums">₺160</p>
        </CarouselItem>
        <CarouselItem className="basis-2/5 ps-3">
          <div className="aspect-square rounded-2xl bg-linear-to-br from-green-500 to-teal-500" />
          <p className="mt-2 truncate text-sm font-semibold">Lentil soup</p>
          <p className="text-xs text-muted-foreground tabular-nums">₺90</p>
        </CarouselItem>
        <CarouselItem className="basis-2/5 ps-3">
          <div className="aspect-square rounded-2xl bg-linear-to-br from-purple-500 to-indigo-500" />
          <p className="mt-2 truncate text-sm font-semibold">Künefe</p>
          <p className="text-xs text-muted-foreground tabular-nums">₺160</p>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}
