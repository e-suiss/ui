import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";
import type * as React from "react";

import { Anchor } from "@/components/site/anchor";
import { Gradient } from "@/components/site/gradient";
import { InstallCommand } from "@/components/site/install-command";
import { Search } from "@/components/site/search";

const frame = "mx-auto w-full max-w-[1680px] px-5 md:px-10";
const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]";

const collections = [
  {
    title: "Components",
    href: "/docs/components",
    description: "Buttons, inputs, dialogs, sheets, menus and the rest of the building blocks.",
  },
  {
    title: "Patterns",
    href: "/docs/patterns",
    description: "Pickers, confirmations, flyouts and lists composed from components.",
  },
  {
    title: "Interactions",
    href: "/docs/interactions",
    description: "Pull to refresh, swipe actions and steppers that feel native.",
  },
];

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
          Build with suiss/uim.
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
        Native components you own.{" "}
        <span className="text-label-tertiary">
          Copy them into your Expo or React Native app and change anything you like.
        </span>{" "}
        Uniwind, NativeWind or StyleSheet.{" "}
        <span className="text-label-tertiary">Accessible, themeable and open source.</span>
      </p>
    </section>
  );
}

function Start() {
  return (
    <section className={cn(frame, "flex flex-col gap-6 pb-32 md:pb-48")}>
      <Label index="02">Start in one line</Label>
      <InstallCommand command="npx @esuiss/uim@latest init" />
    </section>
  );
}

function Library() {
  return (
    <section className="pb-32 md:pb-48">
      <div className={cn(frame, "mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_3fr]")}>
        <Label index="03">Library</Label>
        <h2 className="text-[clamp(2.5rem,5vw,5rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
          Three collections.{" "}
          <span className="text-label-tertiary">One design language.</span>
        </h2>
      </div>
      <ul className={cn(frame, "flex flex-col")}>
        {collections.map((collection, index) => (
          <li key={collection.href} className="border-t border-label/15 last:border-b">
            <Anchor
              href={collection.href}
              className="group grid items-center gap-4 py-8 outline-none focus-visible:focus-ring md:grid-cols-[1fr_3fr] md:gap-6 md:py-10"
            >
              <span className="font-mono text-xs text-label-secondary">{String(index + 1).padStart(2, "0")}</span>
              <span className="flex items-center justify-between gap-6">
                <span className="flex flex-col gap-3">
                  <span
                    className={cn(
                      "text-[clamp(2rem,4vw,3.5rem)] leading-none font-semibold tracking-[-0.045em] transition-transform duration-700 group-hover:translate-x-2",
                      ease,
                    )}
                  >
                    {collection.title}
                  </span>
                  <span className="max-w-xl text-[17px] leading-[1.4] tracking-[-0.02em] text-label-secondary">
                    {collection.description}
                  </span>
                </span>
                <span
                  className={cn(
                    "hidden size-12 items-center justify-center rounded-full border border-label/15 transition-colors duration-500 group-hover:border-transparent group-hover:bg-label group-hover:text-surface md:flex",
                    ease,
                  )}
                >
                  <ArrowUpRightIcon className="size-4" />
                </span>
              </span>
            </Anchor>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Start />
      <Library />
    </main>
  );
}
