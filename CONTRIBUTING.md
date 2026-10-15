# Contributing

Thanks for your interest in suiss/ui. This guide covers how the repository is laid out, how to run it, and how changes reach users.

Commits follow [Conventional Commits](https://www.conventionalcommits.org), e.g. `fix: correct dialog padding`.

## Development

This repository is a pnpm workspace. One install at the root sets up everything:

```bash
pnpm install
pnpm dev             # the ui.suiss.app site on :3000
pnpm build           # build the site
pnpm typecheck       # every package and site
pnpm test            # web component tests and CLI tests
pnpm check           # Biome on the whole repository: libraries, CLI and site
pnpm format          # apply Biome fixes and formatting
pnpm knip            # unused files, exports, and dependencies in every package
pnpm registry        # regenerate the web and mobile registries
pnpm registry:check  # fail if a registry is out of date
pnpm --filter @esuiss/web exec vitest --project examples  # render every web example and run its tests in the browser
pnpm --filter @esuiss/mobile start                        # the React Native Storybook app
```

Layout:

- `apps/ui`: the ui.suiss.app site, with a React, React Native, SwiftUI and Compose tab on every page. Every page is one hand-written MDX file in `content/docs`, and each section's sidebar order is its `meta.json`.
- `packages/web`: the web library. `components/` and `hooks/` are the files `add` copies into projects, `styles/globals.css` is the theme `init` writes, `styles/theme.css` holds the theme transition styles `add theme` appends to the user's stylesheet, `examples/` has one example per file that the site previews and Vitest renders, `tests/` has the browser tests, and `registry.json` lists everything.
- `packages/mobile`: the mobile library: React Native components for Uniwind, NativeWind and StyleSheet, the SwiftUI and Jetpack Compose libraries with their catalog apps, stories and its own `registry.json`. See `packages/mobile/README.md`.
- `packages/tokens`: the design tokens the mobile themes are generated from.
- `packages/cli`: the `@esuiss/ui` command.

## Adding a component

1. Write the component in `packages/web/components/ui/` (or `patterns/`, `interactions/`, `charts/`, `blocks/`). The pre-commit hook adds it to `packages/web/registry.json`, which is what the CLI installs from.
2. Add its examples to `packages/web/examples/`, one file per example with a single default-exported component: `button-demo.tsx` for the first one, then names such as `button-variants.tsx` or `dialog-without-close-button.tsx`. Write them as plain React that users can copy, and leave overlays closed so they don't open on page load. Charts and blocks are previewed directly and need no example file.
3. `tests/examples/render.test.tsx` renders every example file. Put interaction tests in `packages/web/tests/examples/<component>.test.tsx`: render the example with `renderExample` and assert on it. The accessibility, visual, RTL, mobile, responsive, motion, text size and long text checks run after every test in `tests/examples` (`pnpm --filter @esuiss/web test:a11y` and the other `test:*` scripts).
4. Add the page to `apps/ui/content/docs/<section>/<name>.mdx` and its name to that section's `meta.json`. The page uses:
   - `<ComponentPreview name="button-variants" />` for a web example, with the Preview and Code tabs. The code shown is the example file. Add `layout="padded"` or `layout="fullscreen"` when the example should not be centered, and `responsive` to preview it in a resizable frame. Charts and blocks use `<ComponentPreview type="chart" name="area-chart-default" />` and `type="block"`.
   - `<ComponentSource path="components/ui/button.tsx" />` for the source to copy under Manual installation. Mobile sources use paths such as `uniwind/components/ui/button.tsx`, `swift/Components/Button.swift` and `kotlin/components/Button.kt`.
   - `<NativeExample id="components-button--variants" />` for a mobile example. The id is the React Native Storybook id. The React Native, SwiftUI and Compose code is read from `packages/mobile/stories` and the catalog apps, and the preview from `apps/ui/public/previews/<id>.light.webp` and `.dark.webp` (or `.mp4`).
   - `<Only platform="web">` and `<Only platform="rn swift kotlin">` around the parts for each platform, with `platforms` in the frontmatter listing the tabs the page has.
   - Plain Markdown tables for the API reference, inside `<ApiPart index={1}>`, and `<Anatomy>` around a nested list of the parts.

## Compatibility check

`pnpm compat` checks that the components work in a project set up with the standard registry CLI. It creates a Next.js app in the system temp folder and, for each primitive base, runs the registry CLI `init` with `--base base` or `--base radix` and its defaults. It adds a set of components, patterns, a chart, blocks and `theme` once with `packages/cli` from the local `packages/web` files and once with the registry CLI from a local build of the registry, then runs `tsc --noEmit` and `next build` for each app. `--base=base` or `--base=radix` runs one base, and `--icons=<library>` picks the icon library for the registry CLI (`lucide` by default). It needs network access to npm, takes several minutes, and deletes the apps when it finishes or fails.

```bash
pnpm compat
```

## Git hooks

Git hooks are installed by `pnpm install`:

- pre-commit: Biome fixes and checks the staged files (warnings fail too). Changed web components regenerate `packages/web/registry.json`; changed mobile components, the Uniwind stylesheet or the tokens regenerate the NativeWind files, the themes and `packages/mobile/registry.json`.
- commit-msg: commitlint enforces [Conventional Commits](https://www.conventionalcommits.org), e.g. `fix: correct dialog padding`.
- pre-push: Biome, Knip, typecheck, the registry checks and the tests.

## Deploy

Every push to `main` that changes the site builds the `apps/Dockerfile` image for `linux/amd64` and `linux/arm64` and pushes it to `ghcr.io/e-suiss/ui`, tagged `latest` and with the short commit SHA. The server only pulls and runs it:

```bash
docker pull ghcr.io/e-suiss/ui:latest
docker run -d -p 3000:3000 ghcr.io/e-suiss/ui:latest
```

To build it locally, run `docker build -f apps/Dockerfile .` from the repository root.

## Release

Component, hook, and theme color changes, on the web and on mobile, reach users as soon as they are pushed to `main`. Releasing is needed when `packages/cli` changes:

```bash
pnpm release patch   # or minor, major, or an exact version like 1.0.0
```

This bumps the CLI version, commits, tags `vX.Y.Z`, and pushes. GitHub Actions then publishes it to npm, publishes `packages/mobile/swiftui` and `packages/mobile/kotlin` to [e-suiss/uim-swift](https://github.com/e-suiss/uim-swift) and [e-suiss/uim-kotlin](https://github.com/e-suiss/uim-kotlin) with the same tag, and creates the GitHub release.
