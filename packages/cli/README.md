# @esuiss/ui

Copy-paste React components with a clean, minimal design, built with [Tailwind CSS](https://tailwindcss.com) v4 on your choice of three primitive bases, [Base UI](https://base-ui.com) by default.

**[Documentation](https://suiss.app/ui/docs)** · [Components](https://suiss.app/ui/docs/components) · [CLI reference](https://suiss.app/ui/docs/cli) · [GitHub](https://github.com/e-suiss/ui)

`@esuiss/ui` is a command-line tool. It does not ship components as a dependency. Instead, it copies their source into your project so you own the code and can change it however you like.

- 67 accessible components and 5 hooks, from buttons and dialogs to sidebars, charts, and chat views
- A refined color palette for light and dark mode, written in oklch
- [Phosphor](https://phosphoricons.com) icons
- Next.js and React (Vite) with TypeScript
- React Native and Expo, SwiftUI and Jetpack Compose components with the same commands
- No runtime dependency on this CLI: it runs with `npx` and is never installed in your project

## Requirements

- Next.js or React with Vite
- TypeScript
- Tailwind CSS 4.2 or later (installed for you if missing)
- Node.js 20 or later

## Mobile apps

Run the same commands in an Expo or React Native app, an Xcode project or an Android Gradle module, and the CLI adds the matching React Native, SwiftUI or Compose sources:

```bash
npx @esuiss/ui@latest init
npx @esuiss/ui@latest add dialog
npx @esuiss/ui@latest add dialog --platform swift
npx @esuiss/ui@latest add dialog --platform kotlin
```

React Native projects can pick a styling with `--styling uniwind|nativewind|stylesheet`; SwiftUI and Compose files go to `--path <dir>` when given. In a Swift package with several targets, pass `--path`, or pick the target from a list. When a folder holds more than one project, choose one with `--platform web|rn|swift|kotlin`.

## Quick start

Set up a project once:

```bash
npx @esuiss/ui@latest init
```

Then add components:

```bash
npx @esuiss/ui@latest add button dialog sidebar
```

Use them:

```tsx
import { Button } from "@/components/ui/button"

export function Example() {
  return <Button>Continue</Button>
}
```

### Registry CLI

The React items are also a registry under the `@esuiss` namespace, so any project with a `components.json` can add them without this CLI:

```bash
npx shadcn@latest add @esuiss/button @esuiss/dialog
npx shadcn@latest add @esuiss/theme-suiss
```

Until the namespace is listed in the public registry directory, register it once in `components.json`:

```json
{
  "registries": {
    "@esuiss": "https://suiss.app/ui/r/{style}/{name}.json"
  }
}
```

Every item is published for three primitive bases under the same name. A `radix-*`, `new-york` or `default` style in `components.json` installs the second base, an `aria-*` style the third, and every other style the default base. This CLI follows the same `style`, or `--base`. `init --base` saves the base as the `style` in `components.json`, creating the file when needed, so later `add` runs use it without the flag.

## What `init` does

1. Detects Next.js or Vite and checks for TypeScript and Tailwind CSS 4.2+.
2. Adds the `@/*` import alias to `tsconfig.json` if it is missing.
3. Installs and wires up Tailwind CSS if needed (`postcss.config.mjs` for Next.js, `vite.config.ts` for Vite).
4. Writes the theme stylesheet to the `tailwind.css` file named in `components.json`, otherwise to `app/globals.css` (Next.js) or `src/index.css` (Vite). It asks before replacing a stylesheet that already has content.
5. Sets up the font: text uses the system font on macOS and Inter everywhere else. Inter is loaded with `next/font/google` in the root layout (Next.js), or with `@fontsource-variable/inter` imported from the stylesheet (Vite).
6. Installs `tw-animate-css` and `shadcn`, whose stylesheets provide the animations, variants, and utilities the components rely on.
7. Adds the `button` component. With `--overwrite` it replaces a local `button` that differs from the registry.

## Commands

### `init`

```bash
npx @esuiss/ui@latest init [options]
```

### `add`

```bash
npx @esuiss/ui@latest add
npx @esuiss/ui@latest add <component...> [options]
npx @esuiss/ui@latest add patterns <pattern...> [options]
npx @esuiss/ui@latest add interactions <interaction...> [options]
npx @esuiss/ui@latest add charts <chart...> [options]
npx @esuiss/ui@latest add blocks <block...> [options]
```

Run `add` without names to pick from a list: choose components, patterns, interactions, charts or blocks, type to filter, select with space and press enter. `add patterns` (or another group) without names opens the list for that group. Outside an interactive terminal, `add` without names prints the available names instead.

Components are written to `components/ui/`, patterns to `components/patterns/`, interactions to `components/interactions/`, charts to `components/charts/`, blocks to `components/blocks/` and hooks to `hooks/` under your `@/*` alias root. Components they depend on are added too, and missing npm packages are installed with your package manager (npm, pnpm, yarn, or bun): the `packageManager` field in `package.json` decides, then the package manager that runs the CLI (`pnpm dlx`, `yarn dlx` or `bunx`), then the lockfile of the project or its workspace.

### Options

| Option | Description |
| --- | --- |
| `-o, --overwrite` | Replace local files that differ from the registry, including the components they depend on (`init` too) |
| `--diff` | Show how your local files differ from the registry, for every file `--overwrite` would replace |
| `-a, --all` | Add every component except `theme`, or every pattern, interaction, chart or block with `add patterns` / `add interactions` / `add charts` / `add blocks` |
| `-y, --yes` | Skip confirmation prompts and the pick list |
| `-b, --base <base\|radix\|aria>` | Primitive base of React components, read from the `style` in `components.json` when omitted, otherwise `base`. `init` saves it there |
| `-p, --platform <web\|rn\|swift\|kotlin>` | Pick the platform when the folder holds more than one project |
| `-s, --styling <uniwind\|nativewind\|stylesheet>` | React Native styling, detected from the project when omitted |
| `--style <name>` | The visual style, one of `suiss` (default), `vega`, `nova`, `maia`, `lyra`, `mira`, `luma`, `sera` or `rhea`. For React it is read from and saved to the `style` in `components.json`, and `add` follows it; for React Native, SwiftUI and Compose `init` sets radius, control sizes, paddings, weights and shadows through the theme |
| `--preset <code>` | `init` only: a preset code from suiss.app/ui/create. React applies its style, colors, radius, icon library and menu color; React Native, SwiftUI and Compose use its style like `--style` |
| `--theme suiss` | `init` only: keep the suiss/ui colors when applying a preset |
| `--icon-library <name>` | React Native, SwiftUI and Compose icons: `phosphor` (default), `lucide`, `tabler`, `hugeicons` or `remixicon`; read from `--preset` or the installed icons file when omitted |
| `--path <dir>` | Where SwiftUI or Compose files go, relative to the project |
| `-c, --cwd <dir>` | Run in another project directory |
| `-h, --help` | Show help, or the help of a command with `init --help` and `add --help` |
| `-v, --version` | Show the version |

## Updating components

Components are your code, so updates never overwrite your changes silently. Review the latest version first, then replace your copy if you want it:

```bash
npx @esuiss/ui@latest add button --diff
npx @esuiss/ui@latest add button --overwrite
```

`--diff` and `--overwrite` cover the same files: the components you name and every component they depend on. Running `add` for a component you already have keeps your file and tells you when it differs from the registry.

Each CLI version downloads the registry from the release tag of that version, so a pinned version keeps working when the registry changes. Use `@latest` for the newest components.

## Theming

Your stylesheet holds the whole theme:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/inter";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.2316 0.0038 286.09);
  --primary: oklch(0.5629 0.1933 256.16);
  --primary-foreground: oklch(1 0 0);
}

.dark {
  --background: oklch(0 0 0);
  --foreground: oklch(0.9707 0.0026 286.29);
  --primary: oklch(0.669 0.1808 251.84);
  --primary-foreground: oklch(1 0 0);
}

@theme inline {
  --font-sans: -apple-system, BlinkMacSystemFont, "Inter Variable", sans-serif;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

The web components use the common theme variables, so themes written with the same names drop in:

- **Base:** `background`, `foreground`, `card`, `popover` and their `-foreground` text colors.
- **Actions:** `primary`, `secondary`, `accent`, `destructive`, with `primary-foreground`, `secondary-foreground` and `accent-foreground`.
- **Quiet:** `muted` and `muted-foreground` for secondary text.
- **Lines and focus:** `border`, `input`, `ring`.
- **Charts:** `chart-1` to `chart-5`.
- **Sidebar:** `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`.

States use opacity rather than extra variables (`hover:bg-primary/80`, `bg-destructive/10`), and disabled elements use `disabled:opacity-50`. Status colors come from the Tailwind palette, such as `text-green-600 dark:text-green-400`.

- **Change a color:** edit its value under `:root` (light) and `.dark` (dark).
- **Add a color:** define it under `:root` and `.dark`, then map it in `@theme inline`, for example `--color-brand: var(--brand);`. Classes such as `bg-brand` and `text-brand` become available.
- **Change the font:** set `--font-sans` in `@theme inline`. It uses the system font on macOS and Inter elsewhere.
- **Corner radius:** `--radius` scales every rounded component.

## Dark mode

Dark mode is enabled by the `dark` class on `<html>`; every variable above switches with it. If you want a theme switch, add the theme component. It is not added by `add --all`, so projects that stay in one appearance never get it:

```bash
npx @esuiss/ui add theme
```

It gives you `ThemeProvider`, `useTheme`, `ThemeToggle` and `ThemeScript`. The provider remembers the choice (`light`, `dark` or `system`) and follows the system setting when it is `system`. `ThemeScript` sets the class before the page paints, so there is no flash of the wrong theme.

With Next.js:

```tsx
import { ThemeProvider, ThemeScript } from "@/components/ui/theme"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

With Vite, wrap your app in `ThemeProvider` and put the same script in `index.html`, before your app script:

```html
<script>
  (()=>{try{var t=localStorage.getItem("theme")||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()
</script>
```

`ThemeToggle` switches with an animated reveal built on the View Transitions API. Choose the `effect` (`circle`, `rectangle`, `polygon` or `circle-blur`), where it starts with `origin`, and add `blur` for a softer edge:

```tsx
<ThemeToggle effect="circle" origin="top-right" />
<ThemeToggle effect="rectangle" origin="bottom-up" blur />
```

Use `setTheme` from `useTheme` to build your own control. Pass a transition as the second argument to animate it, or leave it out to switch instantly. Browsers without View Transitions, and visitors who prefer reduced motion, switch instantly either way.

```tsx
const { theme, setTheme } = useTheme()
setTheme("system", { effect: "circle", origin: "top-center" })
```

## Components

accordion, alert, alert-dialog, alert-sheet, aspect-ratio, attachment, avatar, badge, breadcrumb, bubble, button, button-group, calendar, card, carousel, chart, checkbox, collapsible, combobox, command, context-menu, dialog, direction, drawer, dropdown-menu, empty, field, fullscreen-menu, hover-card, input, input-group, input-otp, item, kbd, label, marker, menubar, message, message-scroller, native-select, navigation-menu, pagination, popover, progress, questionnaire, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, spinner, switch, tab-bar, table, tabs, textarea, theme, toast, toggle, toggle-group, tooltip, wheel-picker, widget

Hooks: use-message-scroller, use-mobile, use-platform, use-questionnaire, use-scrollbar-gap

## Patterns

Patterns combine several components into one ready-made piece, such as a date and time picker. They are not added by `init` or `add --all`; add them by name, or all at once:

```bash
npx @esuiss/ui add patterns date-picker
npx @esuiss/ui add patterns --all
```

The components a pattern uses are added with it.

## Interactions

Interactions add a behavior to something you already have, such as swiping a row to reveal actions. They are optional extras, so they are not added by `init` or `add --all`; add them by name, or all at once:

```bash
npx @esuiss/ui add interactions swipe-actions
npx @esuiss/ui add interactions --all
```

The components an interaction uses are added with it.

## Charts

Charts are ready-made charts built on the `chart` component. They are optional extras, so they are not added by `init` or `add --all`; add them by name, or all at once:

```bash
npx @esuiss/ui add charts <name>
npx @esuiss/ui add charts --all
```

The `chart` component and anything else a chart uses are added with it.

## Blocks

Blocks are ready-made sections of a page built from the components. They are optional extras, so they are not added by `init` or `add --all`; add them by name, or all at once:

```bash
npx @esuiss/ui add blocks <name>
npx @esuiss/ui add blocks --all
```

The components a block uses are added with it.

## Troubleshooting

- **"Tailwind CSS 4.2 or later is required"**: upgrade with `npm install tailwindcss@latest` and run `init` again.
- **"No `@/*` import alias found"**: run `init` first, or add `"paths": { "@/*": ["./src/*"] }` to `compilerOptions` in `tsconfig.json`.
- **A newly published version is not found**: npm can take a few minutes to make new versions available. Run `npx --prefer-online @esuiss/ui@latest ...`.

## License

MIT
