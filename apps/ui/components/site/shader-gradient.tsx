"use client";

import { type GradientT, presetsArray, ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export type GradientPreset =
  | "Halo"
  | "Pensive"
  | "Universe"
  | "Mint"
  | "Interstella"
  | "Nighty night"
  | "Sunset";

const overrides: Partial<Record<GradientPreset, Partial<GradientT>>> = {
  Halo: { cDistance: 2.6 },
};

export default function ShaderGradientBackground({ preset }: { preset: GradientPreset }) {
  const props = presetsArray.find((item) => item.title === preset)?.props as GradientT | undefined;

  return (
    <ShaderGradientCanvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      pixelDensity={1.5}
      fov={45}
    >
      <ShaderGradient control="props" {...props} {...overrides[preset]} />
    </ShaderGradientCanvas>
  );
}
