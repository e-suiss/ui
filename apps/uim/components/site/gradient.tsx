"use client";

import { cn } from "cn";
import dynamic from "next/dynamic";
import * as React from "react";

import type { GradientPreset } from "@/components/site/shader-gradient";

const ShaderGradientBackground = dynamic(() => import("@/components/site/shader-gradient"), {
  ssr: false,
});

const fallbacks: Record<GradientPreset, string> = {
  Halo: "bg-[radial-gradient(120%_90%_at_20%_30%,#ff5005_0%,#dbba95_45%,#d0bce1_100%)]",
  Pensive: "bg-[radial-gradient(120%_90%_at_30%_40%,#af38ff_0%,#910aff_40%,#809bd6_100%)]",
  Universe: "bg-[radial-gradient(120%_90%_at_30%_40%,#fe8989_0%,#5606ff_50%,#000000_100%)]",
  Mint: "bg-[radial-gradient(120%_90%_at_30%_40%,#94ffd1_0%,#6bf5ff_50%,#ffffff_100%)]",
  Interstella: "bg-[radial-gradient(120%_90%_at_30%_40%,#ff810a_0%,#73bfc4_50%,#8da0ce_100%)]",
  "Nighty night": "bg-[radial-gradient(120%_90%_at_30%_40%,#8d7dca_0%,#606080_50%,#212121_100%)]",
  Sunset: "bg-[radial-gradient(120%_90%_at_30%_40%,#ffc53d_0%,#ff7a33_45%,#33a0ff_100%)]",
};

function useNearViewport(ref: React.RefObject<HTMLElement | null>) {
  const [near, setNear] = React.useState(false);
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry?.isIntersecting ?? false), {
      rootMargin: "300px",
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return near;
}

export function Gradient({ preset, className }: { preset: GradientPreset; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref);

  return (
    <div ref={ref} aria-hidden className={cn("absolute inset-0 overflow-hidden", fallbacks[preset], className)}>
      <div className="absolute inset-x-0 top-1/2 h-[max(100%,100svh)] -translate-y-1/2">
        {near && <ShaderGradientBackground preset={preset} />}
      </div>
    </div>
  );
}
