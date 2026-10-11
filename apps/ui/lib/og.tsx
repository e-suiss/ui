import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

const font = (weight: 500 | 600) =>
  readFile(path.join(process.cwd(), "node_modules/@fontsource/inter/files", `inter-latin-${weight}-normal.woff`));

async function fonts() {
  const [medium, semibold] = await Promise.all([font(500), font(600)]);
  return [
    { name: "Inter", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Inter", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

export async function ogImage({ title, description, eyebrow }: { title: string; description?: string; eyebrow?: string }) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 72,
        fontFamily: "Inter",
        fontWeight: 500,
        color: "#1d1d1f",
        backgroundColor: "#dbba95",
        backgroundImage: "radial-gradient(circle at 18% 22%, #ff5005 0%, #dbba95 48%, #d0bce1 100%)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 32, fontWeight: 600, letterSpacing: -1 }}>
        <span>{site.name}</span>
        {eyebrow && eyebrow !== site.name && <span style={{ fontSize: 22, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7 }}>{eyebrow}</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: title.length > 24 ? 84 : 112, fontWeight: 600, letterSpacing: -5, lineHeight: 0.95 }}>{title}</div>
        {description && (
          <div style={{ fontSize: 32, lineHeight: 1.3, letterSpacing: -0.5, opacity: 0.75, maxWidth: 980 }}>{description}</div>
        )}
      </div>
    </div>,
    { ...ogSize, fonts: await fonts() },
  );
}

export async function iconImage(size: number) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        borderRadius: size * 0.22,
        color: "#ffffff",
        backgroundColor: "#1d1d1f",
        fontFamily: "Inter",
        fontSize: size * 0.5,
        fontWeight: 600,
        letterSpacing: -size * 0.03,
      }}
    >
      s/
    </div>,
    { width: size, height: size, fonts: await fonts() },
  );
}
