import { type Locale, localePath } from "@/lib/i18n"

export const site = {
  name: "suiss",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://suiss.app").replace(
    /\/$/,
    ""
  ),
  github: "https://github.com/e-suiss",
}

export const absolute = (path: string) =>
  `${site.url}${path === "/" ? "" : path}`

export const localeUrl = (locale: Locale, path = "/") =>
  absolute(localePath(locale, path))
