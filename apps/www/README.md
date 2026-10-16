# suiss.app

The website of [suiss](https://suiss.app): agent-native infrastructure for people and their agents. One, Access, Relay, Money, Pay, Commerce, Serve and Work, plus the open-source component library [suiss/ui](https://suiss.app/ui).

Built with [Next.js](https://nextjs.org) and Tailwind CSS, in English and Turkish (`/tr`), and exported as a static site.

## Develop

```bash
pnpm --filter @esuiss/www dev
pnpm --filter @esuiss/www build
pnpm --filter @esuiss/www typecheck
```

- `lib/products.ts`: product content in both languages.
- `lib/i18n.ts`: interface text and locale helpers. English is served without a prefix, Turkish under `/tr`.
- `public/images/products/`: still frames for each product.
- `scripts/default-locale.mjs`: moves the English pages to the root of `out/` after the build.
- `public/_redirects` and `public/_headers`: routing and headers for the static host.

Set `NEXT_PUBLIC_SITE_URL` to override the canonical URL.
