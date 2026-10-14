import { Button } from "@/components/ui/button"

const image =
  "https://images.unsplash.com/photo-1634403665443-81dc4d75843a?w=1800&q=80&auto=format&fit=crop"

export function HeroProduct() {
  return (
    <section className="flex flex-col items-center overflow-hidden bg-surface-secondary pt-13 text-center">
      <div className="flex flex-col items-center gap-1.5 px-6 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.45,0,0.2,1)] starting:translate-y-4.5 starting:opacity-0 motion-reduce:transition-none">
        <p className="text-lg font-semibold tracking-tight text-[color-mix(in_oklab,var(--orange),var(--label)_45%)] dark:text-orange">
          New
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-balance md:text-6xl">
          Phone Pro
        </h1>
        <p className="text-2xl text-balance md:text-3xl">
          Beyond professional.
        </p>
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-4 px-6 transition-[opacity,translate] delay-120 duration-1000 ease-[cubic-bezier(0.45,0,0.2,1)] starting:translate-y-4.5 starting:opacity-0 motion-reduce:transition-none">
        <Button size="lg">Learn more</Button>
        <Button
          size="lg"
          variant="outline"
          className="border-accent bg-transparent text-link hover:bg-accent-surface hover:text-link dark:bg-transparent"
        >
          Buy
        </Button>
      </div>
      <img
        src={image}
        alt="A phone resting on a soft beige surface"
        className="mt-7 aspect-[2] w-full max-w-245 bg-control object-cover transition-[opacity,translate] delay-220 duration-1000 ease-[cubic-bezier(0.45,0,0.2,1)] starting:translate-y-4.5 starting:opacity-0 motion-reduce:transition-none"
      />
      <p className="px-6 pt-2.5 pb-4.5 text-xs text-label-secondary">
        From $999 or $41.62/mo. for 24 mo.
      </p>
    </section>
  )
}
