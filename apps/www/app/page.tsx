import type { Metadata } from "next"
import Image from "next/image"
import { Anchor } from "@/components/anchor"
import { Arrow, ease, Label, Pill } from "@/components/arrow"
import { HeroBackground } from "@/components/hero-background"
import { dictionary } from "@/lib/dictionary"
import { pageMetadata } from "@/lib/metadata"
import { libraries, type Product, products } from "@/lib/products"
import { cn } from "@/lib/utils"

const frame = "mx-auto w-full max-w-[1680px] px-5 md:px-10"

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: dictionary.title,
  description: dictionary.description,
  image: "/og/image.png",
})

function Hero() {
  return (
    <section className="relative flex flex-col overflow-hidden text-[#1d1d1f]">
      <HeroBackground />
      <div
        className={cn(
          frame,
          "relative flex flex-col gap-10 pt-56 pb-12 md:pt-[24rem] md:pb-16"
        )}
      >
        <h1 className="max-w-[14ch] text-[clamp(3.5rem,9vw,9.5rem)] leading-[0.86] font-semibold tracking-[-0.055em] text-balance">
          {dictionary.heroTitle}
        </h1>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-[clamp(1.125rem,1.6vw,1.375rem)] leading-[1.35] tracking-[-0.02em] text-[#1d1d1f]/75">
            {dictionary.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Anchor
              href={"/#products"}
              className="group rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Pill dark>{dictionary.exploreProducts}</Pill>
            </Anchor>
            <Anchor
              href={"/#developers"}
              className="group rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Pill className="bg-white/55 backdrop-blur-2xl">
                {dictionary.forDevelopers}
              </Pill>
            </Anchor>
          </div>
        </div>
      </div>
    </section>
  )
}

function Approach() {
  return (
    <section
      className={cn(frame, "grid gap-10 py-24 md:grid-cols-[1fr_3fr] md:py-36")}
    >
      <Label index="01">{dictionary.approachLabel}</Label>
      <p className="text-[clamp(2rem,4.4vw,4.5rem)] leading-[1.04] font-semibold tracking-[-0.045em] text-balance">
        {dictionary.approachLead}{" "}
        <span className="text-foreground/45">
          {dictionary.approachLeadMuted}
        </span>{" "}
        {dictionary.approachBody}{" "}
        <span className="text-foreground/45">
          {dictionary.approachBodyMuted}
        </span>
      </p>
    </section>
  )
}

function Tile({
  product,
  index,
  featured,
}: {
  product: Product
  index: number
  featured?: boolean
}) {
  return (
    <Anchor
      href={`/${product.slug}`}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-black p-6 text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:p-10",
        featured ? "min-h-[min(88svh,52rem)]" : "min-h-[34rem] md:min-h-[40rem]"
      )}
    >
      <Image
        src={product.image}
        alt=""
        fill
        sizes={featured ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
        className={cn(
          "object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]",
          ease
        )}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55"
      />

      <div className="relative flex items-start justify-between gap-6 font-mono text-xs tracking-[0.02em] uppercase">
        <span>
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(products.length).padStart(2, "0")}
        </span>
        <span className="text-white/75">{product.category}</span>
      </div>

      <div
        className={cn(
          "relative flex flex-col gap-5",
          featured && "items-center text-center"
        )}
      >
        <p className="font-mono text-xs tracking-[0.02em] text-white/75 uppercase">
          {product.status === "development"
            ? dictionary.inDevelopment
            : dictionary.planned}
        </p>
        <h3
          className={cn(
            "leading-[0.86] font-semibold tracking-[-0.06em]",
            featured
              ? "text-[clamp(5rem,14vw,14rem)]"
              : "text-[clamp(4rem,7vw,7rem)]"
          )}
        >
          {product.name}
        </h3>
        <p
          className={cn(
            "max-w-xl leading-[1.2] font-semibold tracking-[-0.035em] text-balance text-white/90",
            featured
              ? "text-[clamp(1.5rem,2.6vw,2.5rem)]"
              : "text-[clamp(1.375rem,1.9vw,1.875rem)]"
          )}
        >
          {product.tagline}
        </p>
        <span
          className={cn(
            "mt-2 flex items-center gap-4",
            featured && "justify-center"
          )}
        >
          <span className="text-[15px] font-medium tracking-[-0.01em]">
            {dictionary.learnMore}
          </span>
          <Arrow className="border-white/30 group-hover:bg-white group-hover:text-black" />
        </span>
      </div>
    </Anchor>
  )
}

function Products() {
  const [first, second, ...rest] = products
  return (
    <section id="products" className="scroll-mt-20 pb-32 md:pb-48">
      <div
        className={cn(
          frame,
          "mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_3fr]"
        )}
      >
        <Label index="02">{dictionary.productsLabel}</Label>
        <h2 className="text-[clamp(2.5rem,6vw,6rem)] leading-[0.92] font-semibold tracking-[-0.055em] text-balance">
          {dictionary.productsTitle}{" "}
          <span className="text-foreground/45">
            {dictionary.productsTitleMuted}
          </span>
        </h2>
      </div>
      <div className={cn(frame, "flex flex-col gap-3 md:gap-4")}>
        <Tile product={first} index={0} featured />
        <Tile product={second} index={1} featured />
        <div className="grid gap-3 md:gap-4">
          {rest.map((product, index) => (
            <Tile key={product.slug} product={product} index={index + 2} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Verbs() {
  return (
    <section className="pb-32 md:pb-48">
      <div
        className={cn(
          frame,
          "mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_3fr]"
        )}
      >
        <Label index="03">{dictionary.verbsLabel}</Label>
        <h2 className="text-[clamp(2.5rem,5vw,5rem)] leading-[0.92] font-semibold tracking-[-0.055em] text-balance">
          {dictionary.verbsTitle}
        </h2>
      </div>
      <ul className={cn(frame, "flex flex-col")}>
        {products.map((product) => (
          <li
            key={product.slug}
            className="border-t border-foreground/15 last:border-b"
          >
            <Anchor
              href={`/${product.slug}`}
              className="group grid items-center gap-3 py-7 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:grid-cols-[1fr_3fr] md:gap-6 md:py-9"
            >
              <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground uppercase">
                {product.name}
              </span>
              <span className="flex items-center justify-between gap-6">
                <span className="flex flex-col gap-3">
                  <span
                    className={cn(
                      "text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.9] font-semibold tracking-[-0.05em] transition-transform duration-700 group-hover:translate-x-2",
                      ease
                    )}
                  >
                    {product.verb}.
                  </span>
                  <span className="max-w-2xl text-[17px] leading-[1.4] tracking-[-0.02em] text-muted-foreground">
                    {product.question}
                  </span>
                </span>
                <Arrow className="hidden md:flex" />
              </span>
            </Anchor>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Developers() {
  return (
    <section id="developers" className="scroll-mt-20 pb-32 md:pb-48">
      <div
        className={cn(
          frame,
          "mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_3fr]"
        )}
      >
        <Label index="04">{dictionary.developersLabel}</Label>
        <div className="flex flex-col gap-6">
          <h2 className="text-[clamp(2.5rem,6vw,6rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
            {dictionary.developersTitle}
          </h2>
          <p className="max-w-md text-[clamp(1.0625rem,1.4vw,1.3125rem)] leading-[1.35] tracking-[-0.02em] text-muted-foreground">
            {dictionary.developersBody}
          </p>
        </div>
      </div>
      <div className={cn(frame, "grid gap-3 md:gap-4")}>
        {libraries.map((library) => (
          <Anchor
            key={library.slug}
            href={library.url}
            className="group relative flex min-h-[34rem] flex-col justify-between overflow-hidden rounded-[28px] bg-black p-6 text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:min-h-[40rem] md:p-10"
          >
            <Image
              src={library.image}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className={cn(
                "object-cover opacity-80 transition-transform duration-[1400ms] group-hover:scale-[1.04]",
                ease
              )}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"
            />
            <div className="relative flex items-start justify-between gap-6 font-mono text-xs tracking-[0.02em] uppercase">
              <span>{library.status}</span>
              <span className="text-white/75">
                {library.url.replace("https://", "")}
              </span>
            </div>
            <div className="relative flex flex-col gap-5">
              <h3 className="text-[clamp(3.5rem,6vw,6rem)] leading-[0.86] font-semibold tracking-[-0.06em]">
                {library.name}
              </h3>
              <p className="max-w-lg text-[clamp(1.125rem,1.5vw,1.375rem)] leading-[1.3] tracking-[-0.02em] text-white/85">
                {library.tagline}
              </p>
              <ul className="flex flex-wrap gap-2">
                {library.points.map((point) => (
                  <li
                    key={point}
                    className="rounded-full border border-white/25 px-3.5 py-1.5 text-sm tracking-[-0.01em] text-white/90"
                  >
                    {point}
                  </li>
                ))}
              </ul>
              <code className="w-fit rounded-full bg-white/12 px-4 py-2 font-mono text-sm backdrop-blur-xl">
                <span className="text-white/55">$ </span>
                {library.install}
              </code>
              <span className="mt-2 flex items-center gap-4">
                <span className="text-[15px] font-medium tracking-[-0.01em]">
                  {dictionary.visitSite}
                </span>
                <Arrow className="border-white/30 group-hover:bg-white group-hover:text-black" />
              </span>
            </div>
          </Anchor>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Approach />
      <Products />
      <Verbs />
      <Developers />
    </main>
  )
}
