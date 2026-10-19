"use client"

import type { IconProps } from "@phosphor-icons/react"
import * as React from "react"
import { useCodeOptions } from "@/components/site/code-options"
import { DEFAULT_ICONS, type IconLibrary } from "@/lib/code-options"
import { IconPlaceholder as PhosphorIcon } from "../../../../packages/web/app/(create)/components/icon-placeholder"

type IconSet = Record<string, unknown>
type Svg = React.ComponentType<Record<string, unknown>>

const loaders: Record<
  Exclude<IconLibrary, typeof DEFAULT_ICONS>,
  () => Promise<IconSet>
> = {
  lucide: () => import("@/lib/icons/lucide"),
  tabler: () => import("@/lib/icons/tabler"),
  hugeicons: () => import("@/lib/icons/hugeicons"),
  remixicon: () => import("@/lib/icons/remixicon"),
}

const loaded = new Map<IconLibrary, IconSet>()
const loading = new Map<IconLibrary, Promise<IconSet>>()

function load(library: IconLibrary) {
  if (library === DEFAULT_ICONS) return undefined
  const pending = loading.get(library)
  if (pending) return pending
  const promise = loaders[library]().then((icons) => {
    loaded.set(library, icons)
    return icons
  })
  promise.catch(() => loading.delete(library))
  loading.set(library, promise)
  return promise
}

const PreviewIcons = React.createContext<IconLibrary | undefined>(undefined)

export function PreviewIconsProvider({
  children,
  icons,
}: {
  children: React.ReactNode
  icons?: IconLibrary
}) {
  const options = useCodeOptions()
  const parent = React.useContext(PreviewIcons)
  return (
    <PreviewIcons value={icons ?? parent ?? options.icons}>
      {children}
    </PreviewIcons>
  )
}

function useIconSet(library: IconLibrary) {
  const [, setVersion] = React.useState(0)
  React.useEffect(() => {
    if (loaded.has(library)) return
    load(library)?.then(
      () => setVersion((version) => version + 1),
      () => undefined
    )
  }, [library])
  return loaded.get(library)
}

export function IconPlaceholder({
  lucide,
  tabler,
  hugeicons,
  phosphor,
  remixicon,
  ...props
}: IconProps & Record<IconLibrary, string>) {
  const library = React.useContext(PreviewIcons) ?? DEFAULT_ICONS
  const icons = useIconSet(library)
  const name = { lucide, tabler, hugeicons, phosphor, remixicon }[library]
  const icon = icons?.[name]
  if (!icon)
    return (
      <PhosphorIcon
        {...props}
        lucide={lucide}
        tabler={tabler}
        hugeicons={hugeicons}
        phosphor={
          phosphor as React.ComponentProps<typeof PhosphorIcon>["phosphor"]
        }
        remixicon={remixicon}
      />
    )
  if (library === "hugeicons") {
    const Wrapper = icons.HugeiconsIcon as Svg
    return <Wrapper icon={icon} strokeWidth={2} {...props} />
  }
  const Icon = icon as Svg
  return <Icon {...props} />
}
