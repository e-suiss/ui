# esuiss-ui

Component source and registry for esuiss-ui, for Next.js and React (Vite) projects with TypeScript.

## Use in a project

```bash
npx @esuiss/ui@latest init
npx @esuiss/ui@latest add sidebar
```

`init` sets up Tailwind CSS v4, the `@/*` import alias, the theme stylesheet, and the button. `add` copies components into `components/ui/` together with the components and packages they depend on.

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

- pre-commit: Biome fixes and checks the staged files, and `registry.json` is regenerated when components or hooks change.
- pre-push: typecheck, Knip, and the registry check.

- `components/ui/` and `hooks/`: the files `add` copies into projects.
- `styles/globals.css`: the theme and Tailwind setup, written to the project stylesheet by `init`.
- `stories/`: one Storybook file per component. Use the toolbar to switch between light and dark mode.
- `packages/cli/`: the `@esuiss/ui` command.

## Release

Component, hook, and stylesheet changes reach users as soon as they are pushed to `main`. Releasing is only needed when `packages/cli` changes:

```bash
pnpm release patch   # or minor, major, or an exact version like 1.0.0
```

This bumps `packages/cli/package.json`, commits, tags `vX.Y.Z`, and pushes. GitHub Actions then publishes the package to npm and creates the GitHub release.
