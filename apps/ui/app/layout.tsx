import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import { Footer } from "@/components/site/footer"
import { GlobalNav } from "@/components/site/global-nav"
import { JsonLd } from "@/components/site/json-ld"
import { ThemeProvider, ThemeScript } from "@/components/ui/theme"
import { platformScript } from "@/lib/platform"
import { absolute, site } from "@/lib/site"
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
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: "/",
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
      "@id": absolute("/#organization"),
      name: site.organization.name,
      url: site.organization.url,
      logo: absolute("/icon"),
      sameAs: [site.organization.url, site.repository, site.npm],
    },
    {
      "@type": "WebSite",
      "@id": absolute("/#website"),
      name: site.name,
      alternateName: site.alternateNames,
      url: absolute("/"),
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": absolute("/#organization") },
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": absolute("/#software"),
      name: site.name,
      description: site.summary,
      url: absolute("/"),
      codeRepository: site.repository,
      programmingLanguage: site.languages,
      runtimePlatform: site.platform,
      license: "https://opensource.org/licenses/MIT",
      keywords: site.keywords.join(", "),
      author: { "@id": absolute("/#organization") },
      isAccessibleForFree: true,
    },
  ],
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontInter.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <script
          dangerouslySetInnerHTML={{ __html: platformScript }}
          suppressHydrationWarning
        />
        <JsonLd data={structuredData} />
      </head>
      <body className="flex min-h-svh flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <GlobalNav />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
