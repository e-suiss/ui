import { cn } from "cn";
import type * as React from "react";

import { Gradient } from "@/components/site/gradient";
import { InstallCommand } from "@/components/site/install-command";
import { LibraryScroller } from "@/components/site/library-scroller";
import { Bento } from "@/components/site/bento";
import { Search } from "@/components/site/search";

const frame = "mx-auto w-full max-w-[1680px] px-5 md:px-10";

function Label({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-[0.02em] text-label-secondary uppercase">
      ({index}) {children}
    </p>
  );
}

function Hero() {
  return (
    <section className="relative flex flex-col overflow-hidden text-[#1d1d1f]">
      <Gradient preset="Halo" />
      <div className={cn(frame, "relative flex flex-col gap-10 pt-60 pb-12 md:pt-[26rem] md:pb-16")}>
        <h1 className="text-[clamp(3.5rem,9.5vw,9.5rem)] leading-[0.86] font-semibold tracking-[-0.055em]">
          Build with suiss/ui.
        </h1>
        <Search
          variant="field"
          className="h-14 w-full rounded-full bg-white/45 px-5 md:max-w-2xl text-[17px] tracking-[-0.02em] text-[#1d1d1f]/70 backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300 hover:bg-white/60 md:h-16 md:px-6"
        />
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className={cn(frame, "grid gap-10 py-24 md:grid-cols-[1fr_3fr] md:py-36")}>
      <Label index="01">Approach</Label>
      <p className="text-[clamp(2rem,4.4vw,4.5rem)] leading-[1.04] font-semibold tracking-[-0.045em] text-balance">
        Components you own.{" "}
        <span className="text-label-tertiary">
          Copy them into your project and change anything you like.
        </span>{" "}
        Built on Base UI and Tailwind CSS.{" "}
        <span className="text-label-tertiary">Accessible, themeable and open source.</span>
      </p>
    </section>
  );
}

function Interface() {
  return (
    <section className="pb-32 md:pb-48">
      <div className={cn(frame, "mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_3fr]")}>
        <Label index="02">Interface</Label>
        <div className="flex flex-col gap-6">
          <h2 className="text-[clamp(2.5rem,6vw,6rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
            Every piece is live.
          </h2>
          <p className="max-w-md text-[clamp(1.0625rem,1.4vw,1.3125rem)] leading-[1.35] tracking-[-0.02em] text-label-secondary">
            No screenshots. These are the components themselves, running on this page. Try
            them.
          </p>
        </div>
      </div>

      <div className={frame}>
        <Bento />
      </div>

      <div className={frame}>
        <div className="mt-20 md:mt-28">
          <p className="mb-6 font-mono text-xs tracking-[0.02em] text-label-secondary uppercase">
            Start in one line
          </p>
          <InstallCommand command="npx @esuiss/ui@latest init" />
        </div>
      </div>
    </section>
  );
}

function Library() {
  return (
    <LibraryScroller
      header={
        <div className={cn(frame, "grid gap-6 md:grid-cols-[1fr_3fr]")}>
          <Label index="03">Library</Label>
          <h2 className="text-[clamp(2.5rem,5vw,5rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
            Five collections.{" "}
            <span className="text-label-tertiary">One design language.</span>
          </h2>
        </div>
      }
    />
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Interface />
      <Library />
    </main>
  );
}
