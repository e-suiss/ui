# Contributing

Thanks for your interest in suiss/ui. This guide covers how the repository is laid out, how to run it, and how changes reach users.

Commits follow [Conventional Commits](https://www.conventionalcommits.org), e.g. `fix: correct dialog padding`.

## Development

This repository is a pnpm workspace. One install at the root sets up everything:

```bash
pnpm install
pnpm dev             # suiss.app on :3001 and suiss.app/ui on :3000/ui
pnpm build           # build both sites into dist/
pnpm typecheck       # every package and site
pnpm test            # web component tests and CLI tests
pnpm check           # Biome on the whole repository: libraries, CLI and site
pnpm format          # apply Biome fixes and formatting
pnpm knip            # unused files, exports, and dependencies in every package
pnpm registry        # regenerate the web and mobile registries
pnpm registry:check  # fail if a registry is out of date
pnpm --filter @esuiss/web exec vitest --project examples  # render every web example and run its tests in the browser
pnpm --filter @esuiss/mobile start                        # the React Native example gallery
```

Layout:

- `apps/www`: the suiss.app site in English and Turkish, with every suiss product.
- `apps/ui`: the suiss.app/ui site, with a React, React Native, SwiftUI and Compose tab on every page. Every page is one hand-written MDX file in `content/docs`, and each section's sidebar order is its `meta.json`.
- `packages/web`: the web library. `components/` and `hooks/` are the files `add` copies into projects, `styles/globals.css` is the theme `init` writes, `styles/theme.css` holds the theme transition styles `add theme` appends to the user's stylesheet, `examples/` has one example per file that the site previews and Vitest renders, `tests/` has the browser tests, `bases/` holds the components for the other primitive bases, and `registry/registry.json` with one `registry/<base>/registry.json` per other base lists everything.
- `packages/mobile`: the mobile library: React Native components for Uniwind, NativeWind and StyleSheet, the SwiftUI and Jetpack Compose libraries with their catalog apps, stories and its own `registry.json`. See `packages/mobile/README.md`.
- `packages/tokens`: the design tokens the mobile themes are generated from.
- `packages/cli`: the `@esuiss/ui` command.

## Adding a component

1. Write the component in `packages/web/components/ui/` (or `patterns/`, `interactions/`, `charts/`, `blocks/`). The pre-commit hook adds it to `packages/web/registry/registry.json` and the registry of every other base in `packages/web/registry/<base>/`, which are what the CLI installs from.
2. Add its examples to `packages/web/examples/`, one file per example with a single default-exported component: `button-demo.tsx` for the first one, then names such as `button-variants.tsx` or `dialog-without-close-button.tsx`. Write them as plain React that users can copy, and leave overlays closed so they don't open on page load. Charts and blocks are previewed directly and need no example file.
3. `tests/examples/render.test.tsx` renders every example file. Put interaction tests in `packages/web/tests/examples/<component>.test.tsx`: render the example with `renderExample` and assert on it. The accessibility, visual, RTL, mobile, responsive, motion, text size and long text checks run after every test in `tests/examples` (`pnpm --filter @esuiss/web test:a11y` and the other `test:*` scripts).
4. Add the page to `apps/ui/content/docs/<section>/<name>.mdx` and its name to that section's `meta.json`. The page uses:
   - `<ComponentPreview name="button-variants" />` for a web example, with the Preview and Code tabs. The code shown is the example file. Add `layout="padded"` or `layout="fullscreen"` when the example should not be centered, and `responsive` to preview it in a resizable frame. Charts and blocks use `<ComponentPreview type="chart" name="area-chart-default" />` and `type="block"`.
   - `<ComponentSource path="components/ui/button.tsx" />` for the source to copy under Manual installation. Mobile sources use paths such as `uniwind/components/ui/button.tsx`, `swift/Components/Button.swift` and `kotlin/components/Button.kt`.
   - `<NativeExample name="button-variants" />` for a mobile example. Mobile examples live in `packages/mobile/examples/`, one file per example with a single default-exported component, named like the web ones: `button-demo.tsx` for the first one, then `button-variants.tsx` and so on. The React Native code shown is the example file. The SwiftUI and Compose code comes from the catalog apps, matched by section, title and story name (`Components` / `Button` / `variants` is `button-variants`), and the preview of an example without a web twin from `apps/ui/public/previews/<name>.light.webp` and `.dark.webp` (or `.mp4`).
   - `<Only platform="web">` and `<Only platform="rn swift kotlin">` around the parts for each platform, with `platforms` in the frontmatter listing the tabs the page has.
   - Plain Markdown tables for the API reference, inside `<ApiPart index={1}>`, and `<Anatomy>` around a nested list of the parts.

## Compatibility check

`pnpm compat` checks that the components install with the standard registry CLI (`npx shadcn add @esuiss/<item>`) in a new project, for each option of `components.json`. It creates an app in the system temp folder, runs the registry CLI `init` for each primitive base (`--base base`, `--base radix` or `--base aria`), points the `@esuiss` registry at a local build of `packages/web`, adds a set of items (button, dialog, select, dropdown menu, sidebar, a chart, blocks, the date picker pattern, `theme` and `theme-suiss`), checks the written files, then runs `tsc --noEmit` and `next build` (or `tsc -b && vite build`). With the default options it also adds the same items with `packages/cli`. It needs network access to npm and deletes the apps when it finishes or fails.

Each option changes the project the way a user would, through an `init` flag or an edit of `components.json` after `init`, and checks something specific in the written files:

| Option | Changes | Checks |
| --- | --- | --- |
| `--base=base\|radix\|aria` | the primitive base (every base when omitted) | the components import the base's primitives |
| `--framework=vite` | a Vite + React + TypeScript app set up with Tailwind CSS and the `@/` alias, instead of Next.js | the build runs `tsc -b` with the template's strict settings |
| `--icons=lucide\|tabler\|hugeicons\|phosphor\|remixicon` | `iconLibrary`, and installs the library | no icon placeholder is left, and icons come from the chosen library only |
| `--rtl` | `init --rtl` | no physical side classes (`ml-`, `left-`, `text-right`...) are left |
| `--prefix=tw` | `tailwind.prefix`, `@import "tailwindcss" prefix(tw)` and the `@apply` rules in the stylesheet | every class is written as `tw:class` |
| `--css-variables=false` | `init --no-css-variables` | no theme color class (`bg-primary`...) is left |
| `--tsx=false` | a JavaScript app, so `init` sets `tsx` to false | every file is `.jsx` or `.js` |
| `--rsc=false` | `rsc` | files lose their `"use client"` directive |
| `--aliases=custom` | the `components`, `ui`, `lib`, `utils` and `hooks` aliases (`@/kit`, `@/kit/elements`, `@/support`, `@/support/cn`, `@/support/hooks`) | files land in the aliased folders and import through the aliases only |
| `--menu-color=inverted\|default-translucent\|inverted-translucent` | `menuColor` | the menu markers are replaced with `dark` and the translucent styles |

Run a single combination with:

```bash
pnpm compat --base=base --icons=tabler
pnpm compat --base=radix --framework=vite
pnpm compat --base=aria --rtl
pnpm compat --base=base --prefix=tw --keep           # keep the apps to inspect them
pnpm compat --base=base --rtl --cache=/tmp/compat    # reuse the new app across runs
```

Options can be combined. `--cache=<dir>` keeps a copy of the new Next.js or Vite app in that folder and reuses it on the next run, and `--keep` leaves the temp folder in place and prints its path.

Some behaviour of the registry CLI (version pinned in `scripts/compat.mjs`) is not ours to fix, and the check reports it instead of failing:

- With a custom `utils` alias the CLI still writes the helper to `<lib alias>/utils.ts`. The check moves it to the alias, as a user would.
- With `rsc` false, the CLI removes `"use client"` from every other file only. The check requires that it removed some.
- With `cssVariables` false, the CLI writes the base colors as classes such as `bg-oklch(0.205 0 0)`, which Tailwind CSS v4 does not generate.
- Tailwind CSS v4 writes a prefix as `prefix(tw)` and `tw:flex`, so `--prefix` takes letters only.
- Hugeicons needs `@hugeicons/core-free-icons` next to `@hugeicons/react`, which `init` installs for that library.

The prefix and the right-to-left transforms only reach class strings in `className`, `cva()` and `cn()` (and, for right-to-left, the `className` of `mergeProps()`). Keep component classes there, use a ternary rather than `&&` inside a `classNames` prop, and leave out `compoundVariants`, which the prefix transform skips.

GitHub Actions runs the matrix in `.github/workflows/compat.yml` on pushes to `main` and pull requests that change `packages/web`, `packages/cli`, `scripts/compat.mjs`, `apps/ui/next.config.ts` or the lockfile, and every Monday. The Monday run also runs `pnpm compat:rn`, which installs the mobile items in a new Expo app for each styling. `node scripts/compat.mjs --matrix` prints its jobs: the default options, Vite, right-to-left and the prefix for every base in `PRIMITIVES`, and each other option once on the first base. A new base added to `PRIMITIVES` gets its jobs without changing the workflow.

## Git hooks

Git hooks are installed by `pnpm install`:

- pre-commit: Biome fixes and checks the staged files (warnings fail too). Changed web components, hooks, styles, bases or docs pages regenerate the web registries in `packages/web/registry/`; changed mobile components or primitives, the Uniwind stylesheet, the tokens or docs pages regenerate the NativeWind files, the themes, `packages/mobile/registry.json` and the registries in `packages/mobile/registry/`.
- commit-msg: commitlint enforces [Conventional Commits](https://www.conventionalcommits.org), e.g. `fix: correct dialog padding`.
- pre-push: Biome, the registry checks and the tests in parallel with Knip and then typecheck, which run one after the other because both generate the mobile Uniwind types.

GitHub Actions runs the same checks in `.github/workflows/ci.yml` on every push to `main` and every pull request, and builds the SwiftUI library (and runs its tests on a simulator) and the Compose library when `packages/mobile/swiftui`, `packages/mobile/kotlin` or the tokens change.

## Deploy

suiss.app is a static site on Cloudflare. `apps/www` and `apps/ui` are exported with `output: "export"`, and `pnpm build` merges them into `dist/`: the site at the root and the docs under `dist/ui`. One Worker serves the whole domain from that folder (`wrangler.jsonc`). Its code, `worker.js`, runs only for `/ui/r/*` and maps shadcn style names such as `new-york` or `radix-nova` to the matching registry. Headers and redirects live in `apps/www/public/_headers` and `apps/www/public/_redirects`.

Every push to `main` that changes the site runs `.github/workflows/site.yml`. It builds both sites, runs `pnpm run deploy` and submits the docs pages changed by the push to IndexNow.

The workflow needs these repository secrets:

| Secret | Used for |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | a Cloudflare API token that can edit Workers |
| `CLOUDFLARE_ACCOUNT_ID` | the Cloudflare account that owns the suiss.app zone |

Run it by hand from the Actions tab (`main` only). To deploy or notify IndexNow from your machine:

```bash
pnpm build && pnpm run deploy        # needs wrangler login or CLOUDFLARE_API_TOKEN
pnpm indexnow                        # pages changed in the last 2 days
pnpm indexnow --since=2026-01-01     # pages changed since a date
pnpm indexnow --all                  # every page in the sitemaps
```

`wrangler dev` cannot watch the full `dist/` folder (more than 10,000 files fail with `spawn EBADF`); to try the Worker locally, serve a copy without `dist/ui/source`.

## Release

Component, hook, and theme color changes, on the web and on mobile, reach users as soon as they are pushed to `main`. Releasing is needed when `packages/cli` changes:

```bash
pnpm release patch   # or minor, major, or an exact version like 1.0.0
```

This bumps the CLI version, commits, tags that commit `vX.Y.Z`, and pushes both. GitHub Actions then publishes it to npm, publishes `packages/mobile/swiftui` and `packages/mobile/kotlin` to [e-suiss/uim-swift](https://github.com/e-suiss/uim-swift) and [e-suiss/uim-kotlin](https://github.com/e-suiss/uim-kotlin) with the same tag, and creates the GitHub release.

Publishing the two repositories needs the `SWIFT_MIRROR_KEY` and `KOTLIN_MIRROR_KEY` secrets: the private keys of deploy keys with write access to e-suiss/uim-swift and e-suiss/uim-kotlin. The release fails before it publishes anything when one of them is missing.

Every step can be run again: a version already on npm, a tag already in a mirror repository and an existing GitHub release are skipped. To finish a failed release without a new tag, open Actions > Release > Run workflow and enter the tag, e.g. `v1.2.3`, or run:

```bash
gh workflow run release.yml -f tag=v1.2.3
```
