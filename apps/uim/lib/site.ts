import { repository } from "@/lib/sections";
import { strings } from "@/lib/strings";

export const site = {
  name: strings.brand,
  alternateNames: ["suiss uim", "uim.suiss.app"],
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://uim.suiss.app").replace(/\/$/, ""),
  title: `${strings.brand} – Copy-paste components for React Native, SwiftUI and Jetpack Compose`,
  description: strings.heroSubtitle,
  summary:
    "suiss/uim is an open-source collection of accessible React Native components, patterns and interactions with a clean, minimal design, for Expo and React Native projects with TypeScript. Every component ships in three styling flavors with the same API: Uniwind (Tailwind CSS v4), NativeWind v4 (Tailwind CSS v3) and plain React Native StyleSheet. Components are copied into your project with the @esuiss/ui CLI, so you own and can change the code. The same components are also available as SwiftUI and Jetpack Compose (Kotlin) source built from the same design tokens, added with `--platform swift` or `--platform kotlin`. It is the mobile counterpart of suiss/ui.",
  packageName: "@esuiss/ui",
  install: "npx @esuiss/ui@latest init",
  repository,
  npm: "https://www.npmjs.com/package/@esuiss/ui",
  license: "MIT",
  organization: { name: "suiss", url: "https://github.com/e-suiss" },
  keywords: [
    "React Native components",
    "React Native UI library",
    "SwiftUI components",
    "Jetpack Compose components",
    "Kotlin",
    "Swift",
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
  topics: ["React Native", "Expo", "SwiftUI", "Jetpack Compose", "Uniwind", "NativeWind", "TypeScript", "iOS", "Android"],
  platform: ["React Native", "iOS", "Android"],
  languages: ["TypeScript", "Swift", "Kotlin"],
};

export const absolute = (path: string) => `${site.url}${path === "/" ? "" : path}`;
