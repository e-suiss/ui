# @esuiss/tailwind

The type scale, shadows, Tailwind CSS variants, animations, utilities, and base styles used by esuiss-ui components. Installed by `npx @esuiss/ui@latest init`.

```css
@import "tailwindcss";
@import "@esuiss/tailwind";
```

Your theme stays in your own stylesheet: colors under `:root` and `.dark`, and the `@theme inline` block that maps them to Tailwind classes. The type scale (`text-3xs` to `text-3xl`) comes from this package; to change a size, redefine it in your own `@theme` block, for example `--text-base: 1rem;`. The `shadow-md` and `shadow-lg` values come from this package as well and can be overridden the same way. Requires Tailwind CSS 4.2 or later.
