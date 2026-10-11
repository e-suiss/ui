# @esuiss/uim

Copy-paste React Native components with a clean, minimal design for Expo and React Native projects, styled with [Uniwind](https://uniwind.dev), [NativeWind](https://www.nativewind.dev) or plain StyleSheet.

**[Documentation](https://uim.suiss.app/docs)** · [Components](https://uim.suiss.app/docs/components) · [CLI reference](https://uim.suiss.app/docs/cli) · [GitHub](https://github.com/e-suiss/uim)

```bash
npx @esuiss/uim@latest init
npx @esuiss/uim@latest add dialog
npx @esuiss/uim@latest add button --diff
npx @esuiss/uim@latest add button --overwrite
```

`init` sets up Uniwind (Tailwind CSS v4), NativeWind v4 (Tailwind CSS v3) or plain StyleSheet, the `@/*` import alias, the theme stylesheet, the portal host, and the button. In React Native projects without Expo it also sets up the Babel alias resolver and the Reanimated plugin. Requires TypeScript. The styling library is detected from the project, or chosen with `--styling uniwind|nativewind|stylesheet`. 
