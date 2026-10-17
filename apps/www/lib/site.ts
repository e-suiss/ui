export const site = {
  name: "suiss",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://suiss.app").replace(
    /\/$/,
    ""
  ),
  github: "https://github.com/e-suiss",
  npm: "https://www.npmjs.com/org/esuiss",
}

export const absolute = (path: string) =>
  `${site.url}${path === "/" ? "" : path}`
