# @esuiss/tailwind

The type scale, Tailwind CSS variants, animations, utilities, and base styles used by esuiss-ui components. Installed by `npx @esuiss/ui@latest init`.

```css
@import "tailwindcss";
@import "@esuiss/tailwind";
```

Your theme stays in your own stylesheet: colors under `:root` and `.dark`, and the `@theme inline` block that maps them to Tailwind classes. The type scale (`text-3xs` to `text-3xl`) comes from this package; to change a size, redefine it in your own `@theme` block, for example `--text-base: 1rem;`. Requires Tailwind CSS 4.2 or later.
