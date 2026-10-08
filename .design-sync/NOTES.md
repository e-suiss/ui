# design-sync notes

- [GENERAL] The repo has no published `dist/`: components are copy-paste sources. `node .design-sync/build-dist.mjs` (the `buildCmd`) bundles `components/ui/*.tsx` into `.design-sync/.cache/pkg/dist/index.js` with every npm dependency external, emits `.d.ts` files with `tsc`, rewrites `@/` aliases in them to relative paths and writes a `package.json` (`esuiss-ui`) beside them. `cfg.entry` points at that file. Run it before the converter on every sync.
- [GENERAL] `tsc` reports TS4058 for `hooks/use-questionnaire.ts` (a React internal type that cannot be named in declarations). The build script ignores that code only; any other type error stops it.
- [GENERAL] No Playwright chromium is cached on this machine. Run the converter, validate and compare with `DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`.
- [GENERAL] `.storybook/preview.css` imports `styles/globals.css`, which imports `@fontsource-variable/inter`; the converter's decorator bundler has no `.woff2` loader, so `! preview decorator bundle failed` is expected. The only decorator is the light/dark class toggle from `@storybook/addon-themes`, so previews need no provider.
- [GENERAL] There is no shipped stylesheet; `[CSS_FROM_STORYBOOK]` takes the compiled Tailwind CSS from `sb-reference`. It covers every class used in `components/` and `stories/`, plus the theme tokens from `styles/globals.css`.
- Story titles `Chart` and `Resizable` map to `ChartContainer` and `ResizablePanelGroup` through `cfg.titleMap`; `Direction` is a provider and is excluded.
