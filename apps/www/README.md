# suiss.app

The website of [suiss](https://suiss.app): agent-native infrastructure for people and their agents. One, Access, Relay, Money, Pay, Commerce, Serve and Work, plus the open-source component libraries [suiss/ui](https://ui.suiss.app) and [suiss/uim](https://uim.suiss.app).

Built with [Next.js](https://nextjs.org) and Tailwind CSS, in English and Turkish (`/tr`).

## Develop

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
```

- `lib/products.ts`: product content in both languages.
- `lib/i18n.ts`: interface text and locale helpers. English is served without a prefix, Turkish under `/tr`.
- `public/images/products/`: still frames for each product.

Set `NEXT_PUBLIC_SITE_URL` to override the canonical URL.
