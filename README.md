# esuiss-ui

Component source and registry for esuiss-ui, for Next.js and React (Vite) projects with TypeScript.

## Use in a project

```bash
npx @esuiss/ui@latest init
npx @esuiss/ui@latest add sidebar
```

`init` sets up Tailwind CSS (4.2 or later), the `@/*` import alias, the theme stylesheet, and the button. The stylesheet holds your theme: colors in oklch under `:root` and `.dark`, the radius, the font, and the `@theme inline` block that turns them into Tailwind classes such as `bg-surface`, `text-label` and `bg-accent`. Add or change colors there. Variants, animations, and utilities come from the `@esuiss/tailwind` package it imports. `add` copies components into `components/ui/` together with the components and packages they depend on.

Update a component later:

```bash
npx @esuiss/ui@latest add button --diff
npx @esuiss/ui@latest add button --overwrite
```

## Develop

```bash
pnpm install
pnpm typecheck
pnpm check           # lint and format check with Biome
pnpm format          # apply Biome fixes and formatting
pnpm knip            # find unused files, exports, and dependencies
pnpm registry        # regenerate registry.json after changing components or hooks
pnpm registry:check  # fail if registry.json is out of date
pnpm storybook       # preview every component at http://localhost:6006
```

Git hooks are installed by `pnpm install`:

- pre-commit: Biome fixes and checks the staged files (warnings fail too), and `registry.json` is regenerated when components or hooks change.
- commit-msg: commitlint enforces [Conventional Commits](https://www.conventionalcommits.org), e.g. `fix: correct dialog padding`.
- pre-push: Biome on the whole repo, typecheck, Knip, and the registry check.

- `components/ui/` and `hooks/`: the files `add` copies into projects.
- `styles/globals.css`: the theme (oklch colors, radius, font, `@theme inline` names), written to the project stylesheet by `init`.
- `stories/`: one Storybook file per component. Use the toolbar to switch between light and dark mode.
- `packages/cli/`: the `@esuiss/ui` command.
- `packages/tailwind/`: the `@esuiss/tailwind` stylesheet with variants, animations, and utilities.

## Release

Component, hook, and theme color changes reach users as soon as they are pushed to `main`. Releasing is needed when `packages/cli` or `packages/tailwind` changes; both packages are released together with the same version:

```bash
pnpm release patch   # or minor, major, or an exact version like 1.0.0
```

This bumps both packages, commits, tags `vX.Y.Z`, and pushes. GitHub Actions then publishes them to npm and creates the GitHub release.
