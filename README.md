# esuiss-uim

Component source and registry for esuiss-uim, for React Native and Expo projects with TypeScript.

## Use in a project

```bash
npx @esuiss/uim@latest init
npx @esuiss/uim@latest add dialog
```

`init` sets up Uniwind (Tailwind CSS v4) or NativeWind v4 (Tailwind CSS v3), the `@/*` import alias, the theme stylesheet, the Metro config, the portal host in the root layout, and the button. `add` copies components into `components/ui/` together with the components and packages they depend on. In Expo projects packages are installed with `expo install`, so native modules match the Expo SDK. In React Native projects without Expo, `init` also adds the `@/*` alias to Babel with `babel-plugin-module-resolver`, and `add` adds the Reanimated Babel plugin when a component needs it. Run `cd ios && pod install` after adding components there.

The styling library is detected from the project. When neither is installed, `init` asks; pass `--styling uniwind` or `--styling nativewind` to choose up front. For NativeWind, `init` also writes `tailwind.config.js` and the NativeWind Babel preset.

Update a component later:

```bash
npx @esuiss/uim@latest add button --diff
npx @esuiss/uim@latest add button --overwrite
```

## Develop

```bash
pnpm install
pnpm ios             # build the Storybook app and open it in the iOS simulator
pnpm android         # same for Android
pnpm typecheck
pnpm check           # lint and format check with Biome
pnpm format          # apply Biome fixes and formatting
pnpm knip            # find unused files, exports, and dependencies
pnpm nativewind      # regenerate the NativeWind components and stylesheet
pnpm registry        # regenerate registry.json after changing components
pnpm registry:check  # fail if registry.json is out of date
```

Git hooks are installed by `pnpm install`:

- pre-commit: Biome fixes and checks the staged files (warnings fail too). When components or the Uniwind stylesheet change, the NativeWind files and `registry.json` are regenerated.
- commit-msg: commitlint enforces [Conventional Commits](https://www.conventionalcommits.org), e.g. `fix: correct dialog padding`.
- pre-push: Biome on the whole repo, typecheck, Knip, the registry check, and the NativeWind check.

- `components/ui/`: the files `add` copies into projects.
- `styles/uniwind.css`: the theme and Uniwind setup, written to the project stylesheet by `init`. Colors are the Apple system colors, the same values as the web library.
- `nativewind/`, `styles/nativewind.css` and `styles/nativewind.config.js`: the NativeWind v4 versions, generated from the Uniwind sources by `pnpm nativewind`. They use precomputed color tokens such as `bg-destructive-10` instead of opacity modifiers on theme colors, and Tailwind CSS v3 class names. Don't edit them by hand.
- `stories/`: one Storybook file per component, rendered on the device. Light and dark mode follow the system appearance.
- `packages/cli/`: the `@esuiss/uim` command.

## Release

Component and stylesheet changes reach users as soon as they are pushed to `main`. Releasing is only needed when `packages/cli` changes:

```bash
pnpm release patch   # or minor, major, or an exact version like 1.0.0
```

This bumps `packages/cli/package.json`, commits, tags `vX.Y.Z`, and pushes. GitHub Actions then publishes the package to npm and creates the GitHub release.
