"use client"

import { DirectionProvider as BaseDirectionProvider } from "@base-ui/react/direction-provider"
import type * as React from "react"
import { I18nProvider, useLocale } from "react-aria-components"

function DirectionProvider({
  direction = "ltr",
  locale,
  children,
}: {
  direction?: "ltr" | "rtl"
  locale?: string
  children?: React.ReactNode
}) {
  const { locale: current } = useLocale()
  const resolved =
    locale ??
    new Intl.Locale(current, {
      script: direction === "rtl" ? "Arab" : "Latn",
    }).toString()

  return (
    <BaseDirectionProvider direction={direction}>
      <I18nProvider locale={resolved}>{children}</I18nProvider>
    </BaseDirectionProvider>
  )
}

function useDirection() {
  return useLocale().direction
}

export { DirectionProvider, useDirection }
