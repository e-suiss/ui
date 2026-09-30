# esuiss-ui

Component source and registry for esuiss-ui.

## Use in a project

The repository is private, so authenticate once per machine with `gh auth login` (or set `GH_TOKEN`).

```bash
npx shadcn@latest add esuiss/ui/theme
npx shadcn@latest add esuiss/ui/button --overwrite
```

Update a component later:

```bash
npx shadcn@latest add esuiss/ui/button --diff
npx shadcn@latest add esuiss/ui/button --overwrite
```

## Develop

```bash
pnpm install
pnpm typecheck
pnpm registry        # regenerate registry.json after changing components, hooks, or styles/theme.css
pnpm registry:check  # validate the registry
```
