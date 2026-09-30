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
pnpm registry        # regenerate registry.json after changing components or hooks
pnpm registry:check  # fail if registry.json is out of date
pnpm storybook       # preview every component at http://localhost:6006
```

- `components/ui/` and `hooks/`: the files `add` copies into projects.
- `styles/globals.css`: the theme and Tailwind setup, written to the project stylesheet by `init`.
- `stories/`: one Storybook file per component. Use the toolbar to switch between light and dark mode.
- `packages/cli/`: the `@esuiss/ui` command. Publish it with `npm publish` from that folder.
