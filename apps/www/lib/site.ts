export const site = {
  name: "suiss",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://suiss.app").replace(
    /\/$/,
    ""
  ),
  github: "https://github.com/e-suiss",
  npm: "https://www.npmjs.com/org/esuiss",
  x: "https://x.com/suissapp",
  xHandle: "@suissapp",
  instagram: "https://www.instagram.com/suissapp/",
  linkedin: "https://www.linkedin.com/company/suissapp/",
}

export const absolute = (path: string) =>
  `${site.url}${path === "/" ? "" : path}`
