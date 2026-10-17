import { Anchor } from "@/components/anchor"

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col justify-center gap-8 px-5 py-40 md:px-10">
      <p className="font-mono text-xs tracking-[0.02em] text-muted-foreground uppercase">
        (404)
      </p>
      <h1 className="text-[clamp(3.5rem,9vw,9rem)] leading-[0.86] font-semibold tracking-[-0.055em]">
        Page not found.
      </h1>
      <Anchor href="/" className="text-[17px] font-medium text-primary">
        suiss.app
      </Anchor>
    </main>
  )
}
