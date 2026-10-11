import { repository } from "@/lib/sections";
import { strings } from "@/lib/strings";

export const site = {
  name: strings.brand,
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ui.suiss.app").replace(/\/$/, ""),
  title: `${strings.brand} – Copy-paste React components for Base UI and Tailwind CSS`,
  description: strings.heroSubtitle,
  summary:
    "suiss/ui is an open-source collection of accessible React components, patterns, interactions, charts and blocks with a clean, minimal design. Components are built on Base UI and Tailwind CSS v4, written in TypeScript, and copied into your project with the @esuiss/ui CLI, so you own and can change the code.",
  packageName: "@esuiss/ui",
  install: "npx @esuiss/ui@latest init",
  repository,
  npm: "https://www.npmjs.com/package/@esuiss/ui",
  license: "MIT",
  organization: { name: "suiss", url: "https://github.com/e-suiss" },
  keywords: [
    "React components",
    "React UI library",
    "copy-paste components",
    "Base UI",
    "Tailwind CSS",
    "Tailwind CSS v4",
    "TypeScript",
    "Next.js",
    "Vite",
    "accessible components",
    "design system",
    "UI patterns",
    "React charts",
    "UI blocks",
    "component registry",
    "CLI",
  ],
  topics: ["React", "Base UI", "Tailwind CSS", "TypeScript", "Next.js", "Accessibility"],
  platform: "React",
};

export const absolute = (path: string) => `${site.url}${path === "/" ? "" : path}`;
