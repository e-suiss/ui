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
pnpm check           # Biome on the web library, the CLI and the mobile library
pnpm format          # apply Biome fixes and formatting
pnpm knip            # unused files, exports, and dependencies in every package
pnpm registry        # regenerate the web and mobile registries and the site pages
pnpm registry:check  # fail if a registry is out of date
pnpm --filter @esuiss/web storybook     # web Storybook at http://localhost:6006
pnpm --filter @esuiss/mobile start      # the React Native Storybook app
```

Layout:

- `apps/ui`: the ui.suiss.app site, with a React, React Native, SwiftUI and Compose tab on every page.
- `packages/web`: the web library. `components/` and `hooks/` are the files `add` copies into projects, `styles/globals.css` is the theme `init` writes, `stories/` has one Storybook file per component, and `registry.json` lists everything.
- `packages/mobile`: the mobile library: React Native components for Uniwind, NativeWind and StyleSheet, the SwiftUI and Jetpack Compose libraries with their catalog apps, stories and its own `registry.json`. See `packages/mobile/README.md`.
- `packages/tokens`: the design tokens the mobile themes are generated from.
- `packages/cli`: the `@esuiss/ui` command.
- `packages/tailwind`: the `@esuiss/tailwind` stylesheet with variants, animations, and utilities.

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

Component, hook, and theme color changes, on the web and on mobile, reach users as soon as they are pushed to `main`. Releasing is needed when `packages/cli` or `packages/tailwind` changes; both packages are released together with the same version:

```bash
pnpm release patch   # or minor, major, or an exact version like 1.0.0
```

This bumps both packages, commits, tags `vX.Y.Z`, and pushes. GitHub Actions then publishes them to npm, publishes `packages/mobile/swiftui` and `packages/mobile/kotlin` to [e-suiss/uim-swift](https://github.com/e-suiss/uim-swift) and [e-suiss/uim-kotlin](https://github.com/e-suiss/uim-kotlin) with the same tag, and creates the GitHub release.
