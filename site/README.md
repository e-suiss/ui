# suiss docs

Documentation sites for the suiss component libraries:

| Site | Library | Source |
| --- | --- | --- |
| [ui.suiss.app](https://ui.suiss.app) | suiss/ui: copy-paste React components built on Base UI and Tailwind CSS v4 | repository root |
| [uim.suiss.app](https://uim.suiss.app) | suiss/uim: copy-paste React Native components for Expo, styled with Uniwind, NativeWind or StyleSheet | `mobile/` |

Both sites are built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev) in a [Turborepo](https://turborepo.com) workspace. Every page is also served as Markdown for AI assistants: see `/llms.txt`, `/llms-full.txt`, or add `.md` to any docs URL.

## Structure

- `apps/ui`: the suiss/ui site. Component pages are generated from the ui registry with `pnpm registry`.
- `apps/uim`: the suiss/uim site. Component pages are generated from `../mobile` with `pnpm registry` in `apps/uim`.
- `apps/*/components` and `apps/*/hooks` hold copies of the library files the sites render. Run `node scripts/sync-site.mjs` from the repository root after changing a component; the pre-commit hook does it for you.

## Develop

```bash
pnpm install
pnpm dev                    # both sites: ui on :3000, uim on :3001
pnpm dev --filter=uim       # one site
pnpm build
pnpm typecheck
pnpm registry               # regenerate the ui component pages from the repository root
```

Set `NEXT_PUBLIC_SITE_URL` to override the canonical URL of a site.

## Docker

```bash
docker build --build-arg APP=ui -t suiss-docs-ui .
docker build --build-arg APP=uim -t suiss-docs-uim .
```
