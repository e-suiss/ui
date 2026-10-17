import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { notFound } from "next/navigation"

import { Footer } from "@/components/footer"
import { GlobalNav } from "@/components/global-nav"
import { JsonLd } from "@/components/json-ld"
import { ThemeProvider, ThemeScript } from "@/components/ui/theme"
import { getDictionary, isLocale, localePath, locales } from "@/lib/i18n"
import { libraries, products } from "@/lib/products"
import { absolute, site } from "@/lib/site"
import "../globals.css"

const fontInter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dictionary = getDictionary(lang)

  const items = products.map((product) => ({
    label: product.name,
    href: localePath(lang, `/${product.slug}`),
  }))
  const navItems = products.map((product) => {
    const href = localePath(lang, `/${product.slug}`)
    const section = (id: string, label: string) => ({
      label,
      href: `${href}#${id}`,
    })
    return {
      label: product.name,
      href,
      explore: [
        { label: dictionary.overview, href },
        section("principles", dictionary.principlesLabel),
        section("capabilities", dictionary.capabilitiesLabel),
        section("agents", dictionary.agentLabel),
        ...(product.rules
          ? [section("guarantees", dictionary.rulesLabel)]
          : []),
        section("facts", dictionary.factsLabel),
        section("faq", dictionary.faqLabel),
      ],
      quick: product.connections.flatMap((connection) => {
        const related = products.find((other) => other.slug === connection.slug)
        return related
          ? [
              {
                label: related.name,
                href: localePath(lang, `/${related.slug}`),
              },
            ]
          : []
      }),
    }
  })
  const columns = [
    { title: dictionary.products, links: items.slice(0, 4) },
    { title: " ", links: items.slice(4) },
    {
      title: dictionary.developers,
      links: [
        ...libraries.map((library) => ({
          label: library.name,
          href: library.url,
        })),
        { label: dictionary.github, href: site.github },
      ],
    },
    {
      title: dictionary.company,
      links: [
        { label: dictionary.allProducts, href: localePath(lang, "/#products") },
        {
          label: dictionary.switchLanguage,
          href: localePath(lang === "en" ? "tr" : "en", "/"),
        },
      ],
    },
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absolute("/#organization"),
        name: site.name,
        url: site.url,
        logo: absolute("/icon"),
        description: getDictionary("en").description,
        sameAs: [site.github, site.npm],
      },
      {
        "@type": "WebSite",
        "@id": absolute("/#website"),
        name: site.name,
        url: site.url,
        inLanguage: [...locales],
        publisher: { "@id": absolute("/#organization") },
      },
    ],
  }

  return (
    <html
      lang={dictionary.htmlLang}
      className={fontInter.variable}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <JsonLd data={structuredData} />
      </head>
      <body className="flex min-h-svh flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <GlobalNav
            locale={lang}
            items={navItems}
            quickLinks={[
              ...items,
              {
                label: dictionary.allProducts,
                href: localePath(lang, "/#products"),
              },
              {
                label: dictionary.developers,
                href: localePath(lang, "/#developers"),
              },
            ]}
            tagline={[dictionary.taglineStart, dictionary.taglineEnd]}
            labels={{
              menu: dictionary.menu,
              search: dictionary.search,
              searchPlaceholder: dictionary.searchPlaceholder,
              back: dictionary.back,
              explore: dictionary.explore,
              quickLinks: dictionary.quickLinks,
              home: dictionary.home,
              developers: dictionary.developers,
              switchLanguage: dictionary.switchLanguage,
            }}
          />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer
            columns={columns}
            labels={{
              copyright: dictionary.copyright,
              backToTop: dictionary.backToTop,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
