import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/components/site/footer";
import { GlobalNav } from "@/components/site/global-nav";
import { ThemeProvider, ThemeScript } from "@/components/ui/theme";
import { strings } from "@/lib/strings";
import "./globals.css";

const fontInter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: `%s – ${strings.brand}`,
    default: strings.brand,
  },
  description: strings.heroSubtitle,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontInter.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-svh flex-col bg-surface text-label antialiased">
        <ThemeProvider>
          <GlobalNav />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
