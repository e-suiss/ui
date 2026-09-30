# esuiss-ui

Component source and registry for esuiss-ui.

## Use in a project

The repository is private, so authenticate once per machine with `gh auth login` (or set `GH_TOKEN`).

```bash
npx esuiss@latest init
npx esuiss@latest add sidebar
```

`init` sets up the project and installs the theme and button. Components pull in the components they depend on.

Update a component later:

```bash
npx esuiss@latest add button --diff
npx esuiss@latest add button --overwrite
```

## Develop

```bash
pnpm install
pnpm typecheck
pnpm registry        # regenerate registry.json after changing components, hooks, or styles/theme.css
pnpm registry:check  # validate the registry
```

The `esuiss` command lives in `packages/cli`. Publish it with `npm publish` from that folder.
