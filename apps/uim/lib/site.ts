import { repository } from "@/lib/sections";
import { strings } from "@/lib/strings";

export const site = {
  name: strings.brand,
  alternateNames: ["suiss uim", "uim.suiss.app"],
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://uim.suiss.app").replace(/\/$/, ""),
  title: `${strings.brand} – Copy-paste React Native components for Expo`,
  description: strings.heroSubtitle,
  summary:
    "suiss/uim is an open-source collection of accessible React Native components, patterns and interactions with a clean, minimal design, for Expo and React Native projects with TypeScript. Every component ships in three styling flavors with the same API: Uniwind (Tailwind CSS v4), NativeWind v4 (Tailwind CSS v3) and plain React Native StyleSheet. Components are copied into your project with the @esuiss/uim CLI, so you own and can change the code. It is the mobile counterpart of suiss/ui.",
  packageName: "@esuiss/uim",
  install: "npx @esuiss/uim@latest init",
  repository,
  npm: "https://www.npmjs.com/package/@esuiss/uim",
  license: "MIT",
  organization: { name: "suiss", url: "https://github.com/e-suiss" },
  keywords: [
    "React Native components",
    "React Native UI library",
    "Expo components",
    "Expo UI kit",
    "copy-paste components",
    "Uniwind",
    "NativeWind",
    "React Native StyleSheet",
    "Tailwind CSS",
    "TypeScript",
    "iOS",
    "Android",
    "mobile design system",
    "accessible components",
    "Reanimated",
    "component registry",
    "CLI",
  ],
  topics: ["React Native", "Expo", "Uniwind", "NativeWind", "TypeScript", "iOS", "Android"],
  platform: "React Native",
};

export const absolute = (path: string) => `${site.url}${path === "/" ? "" : path}`;
