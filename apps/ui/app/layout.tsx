import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import { Footer } from "@/components/site/footer"
import { GlobalNav } from "@/components/site/global-nav"
import { JsonLd } from "@/components/site/json-ld"
import { ThemeProvider, ThemeScript } from "@/components/ui/theme"
import { withBase } from "@/lib/base-path"
import { baseScript } from "@/lib/code-options"
import { navItems } from "@/lib/nav"
import { platformScript } from "@/lib/platform"
import { absolute, origin, site } from "@/lib/site"
import { strings } from "@/lib/strings"
import "./globals.css"

const fontInter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    template: `%s – ${strings.brand}`,
    default: site.title,
  },
  description: site.description,
  applicationName: site.name,
  keywords: site.keywords,
  authors: [{ name: site.organization.name, url: site.organization.url }],
  creator: site.organization.name,
  publisher: site.organization.name,
  category: "technology",
  alternates: {
    types: { "text/plain": "/llms.txt" },
  },
  icons: {
    icon: { url: withBase("/icon.png"), type: "image/png", sizes: "512x512" },
    apple: { url: withBase("/apple-icon.png"), sizes: "180x180" },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": site.organization.id,
      name: site.organization.name,
      url: site.organization.url,
      logo: site.organization.logo,
      sameAs: [site.organization.github, site.organization.npm],
    },
    {
      "@type": "WebSite",
      "@id": absolute("/#website"),
      name: site.name,
      alternateName: site.alternateNames,
      url: absolute("/"),
      description: site.description,
      inLanguage: "en",
      isPartOf: { "@id": `${origin}/#website` },
      publisher: { "@id": site.organization.id },
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": absolute("/#software"),
      name: site.name,
      description: site.summary,
      url: absolute("/"),
      codeRepository: site.repository,
      sameAs: [site.repository, site.npm],
      programmingLanguage: site.languages,
      runtimePlatform: site.platform,
      license: "https://opensource.org/licenses/MIT",
      keywords: site.keywords.join(", "),
      author: { "@id": site.organization.id },
      isAccessibleForFree: true,
    },
  ],
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`style-suiss ${fontInter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `${platformScript};${baseScript}`,
          }}
          suppressHydrationWarning
        />
        <JsonLd data={structuredData} />
      </head>
      <body className="flex min-h-svh flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <GlobalNav items={navItems()} />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
