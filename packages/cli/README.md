# @esuiss/ui

Copy-paste React components with a clean, minimal design, built on [Base UI](https://base-ui.com) and [Tailwind CSS](https://tailwindcss.com) v4.

`@esuiss/ui` is a command-line tool. It does not ship components as a dependency. Instead, it copies their source into your project so you own the code and can change it however you like.

- 61 accessible components and 3 hooks, from buttons and dialogs to sidebars, charts, and chat views
- A refined color palette for light and dark mode, written in oklch
- [Phosphor](https://phosphoricons.com) icons
- Next.js and React (Vite) with TypeScript
- No runtime dependency on this CLI: it runs with `npx` and is never installed in your project

## Requirements

- Next.js or React with Vite
- TypeScript
- Tailwind CSS 4.2 or later (installed for you if missing)
- Node.js 18 or later

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

## What `init` does

1. Detects Next.js or Vite and checks for TypeScript and Tailwind CSS 4.2+.
2. Adds the `@/*` import alias to `tsconfig.json` if it is missing.
3. Installs and wires up Tailwind CSS if needed (`postcss.config.mjs` for Next.js, `vite.config.ts` for Vite).
4. Writes the theme stylesheet to `app/globals.css` (Next.js) or `src/index.css` (Vite). It asks before replacing a stylesheet that already has content.
5. Sets up the font: the system font on macOS and iOS, Inter everywhere else. Inter is loaded with `next/font/google` in the root layout (Next.js), or with `@fontsource-variable/inter` imported from the stylesheet (Vite).
6. Installs [`@esuiss/tailwind`](https://www.npmjs.com/package/@esuiss/tailwind), which provides the variants, animations, and utilities the components rely on.
7. Adds the `button` component.

## Commands

### `init`

```bash
npx @esuiss/ui@latest init [options]
```

### `add`

```bash
npx @esuiss/ui@latest add <component...> [options]
npx @esuiss/ui@latest add patterns <pattern...> [options]
npx @esuiss/ui@latest add interactions <interaction...> [options]
npx @esuiss/ui@latest add charts <chart...> [options]
npx @esuiss/ui@latest add blocks <block...> [options]
```

Components are written to `components/ui/`, patterns to `components/patterns/`, interactions to `components/interactions/`, charts to `components/charts/`, blocks to `components/blocks/` and hooks to `hooks/` under your `@/*` alias root. Components they depend on are added too, and missing npm packages are installed with your package manager (npm, pnpm, yarn, or bun).

### Options

| Option | Description |
| --- | --- |
| `-o, --overwrite` | Replace local files that differ from the registry |
| `--diff` | Show how your local files differ from the registry |
| `-a, --all` | Add every component, or every pattern, interaction, chart or block with `add patterns` / `add interactions` / `add charts` / `add blocks` |
| `-y, --yes` | Skip confirmation prompts |
| `-c, --cwd <dir>` | Run in another project directory |
| `-h, --help` | Show help |
| `-v, --version` | Show the version |

## Updating components

Components are your code, so updates never overwrite your changes silently. Review the latest version first, then replace your copy if you want it:

```bash
npx @esuiss/ui@latest add button --diff
npx @esuiss/ui@latest add button --overwrite
```

Running `add` for a component you already have keeps your file and tells you when it differs from the registry.

## Theming

Your stylesheet holds the whole theme:

```css
@import "tailwindcss";
@import "@esuiss/tailwind";
@import "@fontsource-variable/inter";

:root {
  --surface: oklch(1 0 0);
  --label: oklch(0.2316 0.0038 286.09);
  --accent: oklch(0.5629 0.1933 256.16);
  --radius: 0.625rem;
}

.dark {
  --surface: oklch(0 0 0);
  --label: oklch(0.9707 0.0026 286.29);
  --accent: oklch(0.5629 0.1933 256.16);
}

@theme inline {
  --font-sans: -apple-system, BlinkMacSystemFont, "Inter Variable", sans-serif;
  --color-surface: var(--surface);
  --color-label: var(--label);
  --color-accent: var(--accent);
}
```

Colors are named by role, not by component:

- **Surfaces:** `surface`, `surface-secondary`, `surface-tertiary`, `surface-raised` (menus, dialogs, cards).
- **Text:** `label`, `label-secondary`, `label-tertiary`, `label-quaternary`.
- **Control fills:** `fill`, `fill-secondary`, `fill-tertiary`.
- **Lines:** `separator`, `separator-strong`.
- **Scrim:** `scrim`, the dimmed layer behind dialogs, sheets and drawers.
- **Accent:** `accent`, `accent-hover`, `accent-pressed`, `on-accent` (text on the accent).
- **Links, focus and states:** `link`, `focus`, `danger`, `success`, `warning` and their `-surface` tints.
- **Palette:** `blue`, `green`, `orange`, `red`, `yellow`, `purple`, `pink`, `indigo`, `teal`, `mint`, `cyan`, `brown`, `gray`, used by charts.

- **Change a color:** edit its value under `:root` (light) and `.dark` (dark).
- **Add a color:** define it under `:root` and `.dark`, then map it in `@theme inline`, for example `--color-brand: var(--brand);`. Classes such as `bg-brand` and `text-brand` become available.
- **Change the font:** set `--font-sans` in `@theme inline`. By default it uses the system font on macOS and iOS and Inter elsewhere.
- **Corner radius:** `--radius` scales every rounded component.

## Dark mode

Dark mode is enabled by the `dark` class on `<html>`. With Next.js, [next-themes](https://github.com/pacocoursey/next-themes) works out of the box:

```tsx
import { ThemeProvider } from "next-themes"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Components

accordion, alert, alert-dialog, alert-sheet, aspect-ratio, attachment, avatar, badge, breadcrumb, bubble, button, button-group, calendar, card, carousel, chart, checkbox, collapsible, combobox, command, context-menu, dialog, direction, drawer, dropdown-menu, empty, field, fullscreen-menu, hover-card, input, input-group, input-otp, item, kbd, label, marker, menubar, message, message-scroller, native-select, navigation-menu, pagination, popover, progress, questionnaire, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, spinner, switch, tab-bar, table, tabs, textarea, toast, toggle, toggle-group, tooltip, wheel-picker

Hooks: use-message-scroller, use-mobile, use-platform, use-questionnaire

## Patterns

Patterns combine several components into one ready-made piece, such as a date and time picker. They are not added by `init` or `add --all`; add them by name, or all at once:

```bash
npx @esuiss/ui add patterns date-time-picker
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
