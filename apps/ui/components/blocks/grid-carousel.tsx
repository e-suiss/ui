"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`

const products = [
  {
    kicker: "New",
    name: "Phone Pro",
    tagline: "Pro through and through.",
    price: "$999",
    image: photo("1714972384975-fbd4f19b1bb3"),
    alt: "An orange phone on a warm gradient",
  },
  {
    kicker: "New",
    name: "Book Air",
    tagline: "Supercharged by S5.",
    price: "$1,099",
    image: photo("1644792863360-40fa85ea52e7"),
    alt: "A laptop on a wooden sideboard",
  },
  {
    name: "Watch Series 11",
    tagline: "Your best health companion.",
    price: "$399",
    image: photo("1696688713460-de12ac76ebc6"),
    alt: "A black smartwatch on a dark fabric",
  },
  {
    kicker: "New",
    name: "Phone Air",
    tagline: "The thinnest phone ever.",
    price: "$899",
    image: photo("1664883410931-2edffc8be5e6"),
    alt: "A silver phone on a light grey background",
  },
  {
    name: "Phone",
    tagline: "More colors. More power.",
    price: "$799",
    image: photo("1714578187196-29775454aa39"),
    alt: "A phone floating among blue spheres",
  },
  {
    name: "Pods Studio",
    tagline: "Active Noise Cancellation.",
    price: "$549",
    image: photo("1599669454699-248893623440"),
    alt: "Black over-ear headphones on a dark background",
  },
]

export function GridCarousel() {
  return (
    <section className="flex flex-col gap-5.5 bg-surface-secondary pt-10 pb-5">
      <h2 className="px-6 text-3xl font-semibold tracking-tight text-balance md:px-12">
        The latest.{" "}
        <span className="text-label-secondary">
          Fresh favorites of the season.
        </span>
      </h2>
      <Carousel
        opts={{ align: "start" }}
        aria-label="Latest products"
        className="flex flex-col gap-0"
      >
        <CarouselContent className="ms-0 gap-5 px-6 pt-2 pb-6 md:px-12">
          {products.map((product) => (
            <CarouselItem key={product.name} className="basis-auto ps-0">
              <a
                href={`#${product.name.toLowerCase().replaceAll(" ", "-")}`}
                className="flex h-110 w-[min(22.5rem,calc(100vw-4rem))] flex-col overflow-hidden rounded-[1.125rem] bg-surface shadow-[2px_4px_12px_rgb(0_0_0/0.08)] transition-[scale,box-shadow] duration-300 ease-[cubic-bezier(0,0,0.5,1)] outline-none hover:scale-101 hover:shadow-[2px_4px_16px_rgb(0_0_0/0.16)] focus-visible:focus-ring motion-reduce:transition-none"
              >
                <div className="flex flex-col gap-1 px-7 pt-7">
                  {product.kicker && (
                    <span className="text-xs font-semibold tracking-wide text-[color-mix(in_oklab,var(--orange),var(--label)_45%)] uppercase dark:text-orange">
                      {product.kicker}
                    </span>
                  )}
                  <span className="text-3xl font-semibold tracking-tight">
                    {product.name}
                  </span>
                  <span className="text-lg">{product.tagline}</span>
                  <span className="mt-1.5 text-sm text-label-secondary">
                    From {product.price}
                  </span>
                </div>
                <img
                  src={product.image}
                  alt={product.alt}
                  className="m-5 min-h-0 flex-1 rounded-xl bg-control object-cover"
                />
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-3 px-6 md:px-12">
          <CarouselPrevious
            variant="secondary"
            size="icon"
            className="static inset-auto my-0"
          />
          <CarouselNext
            variant="secondary"
            size="icon"
            className="static inset-auto my-0"
          />
        </div>
      </Carousel>
    </section>
  )
}
