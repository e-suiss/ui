import { basePath } from "@/lib/base-path"
import { repository } from "@/lib/sections"
import { strings } from "@/lib/strings"

const TRAILING_SLASH = /\/$/

export const origin = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://suiss.app"
).replace(TRAILING_SLASH, "")

export const site = {
  name: strings.brand,
  alternateNames: ["suiss ui", "suiss.app/ui"],
  url: `${origin}${basePath}`,
  title: `${strings.brand} – Copy-paste components for React, React Native, SwiftUI and Jetpack Compose`,
  description: strings.heroSubtitle,
  summary:
    "suiss/ui is an open-source collection of components, patterns, interactions, charts and blocks with a clean, minimal design, for React, React Native, SwiftUI and Jetpack Compose. React components are built with Tailwind CSS v4 on three interchangeable primitive bases; React Native components come in Uniwind, NativeWind and StyleSheet flavors with the same API; SwiftUI and Compose versions share the same design tokens. Every component is copied into your project with the @esuiss/ui CLI, so you own and can change the code.",
  packageName: "@esuiss/ui",
  install: "npx @esuiss/ui@latest init",
  repository,
  npm: "https://www.npmjs.com/package/@esuiss/ui",
  license: "MIT",
  organization: {
    name: "suiss",
    url: origin,
    id: `${origin}/#organization`,
    logo: `${origin}/icon`,
    github: "https://github.com/e-suiss",
  },
  keywords: [
    "React components",
    "React UI library",
    "copy-paste components",
    "headless UI primitives",
    "interchangeable primitive bases",
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
    "React Native components",
    "Expo",
    "Uniwind",
    "NativeWind",
    "SwiftUI components",
    "Jetpack Compose components",
    "iOS",
    "Android",
  ],
  topics: [
    "React",
    "React Native",
    "SwiftUI",
    "Jetpack Compose",
    "Headless primitives",
    "Tailwind CSS",
    "TypeScript",
    "Accessibility",
  ],
  platform: ["React", "React Native", "iOS", "Android"],
  languages: ["TypeScript", "Swift", "Kotlin"],
}

export const absolute = (path: string) =>
  `${site.url}${path === "/" ? "" : path}`
