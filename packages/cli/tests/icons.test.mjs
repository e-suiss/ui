import { describe, expect, it } from "vitest"

import {
  toIcons,
  toPhosphorIcons,
  usesIconPlaceholders,
} from "../lib/icons.mjs"

const component = `"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cva } from "class-variance-authority"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/lib/utils"

export function Checkbox() {
  return (
    <CheckboxPrimitive.Indicator>
      <IconPlaceholder
        lucide="CheckIcon"
        tabler="IconCheck"
        hugeicons="Tick02Icon"
        phosphor="CheckIcon"
        remixicon="RiCheckLine"
      />
      <IconPlaceholder
        lucide="MinusIcon"
        tabler="IconMinus"
        hugeicons="MinusSignIcon"
        phosphor="MinusIcon"
        remixicon="RiSubtractLine"
        className={cn("size-3.5", visible && "block")}
        data-slot="checkbox-icon"
      />
    </CheckboxPrimitive.Indicator>
  )
}
`

describe("toPhosphorIcons", () => {
  it("replaces placeholders with Phosphor icons and keeps other props", () => {
    expect(toPhosphorIcons(component)).toBe(`"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon, MinusIcon } from "@phosphor-icons/react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

export function Checkbox() {
  return (
    <CheckboxPrimitive.Indicator>
      <CheckIcon />
      <MinusIcon
        className={cn("size-3.5", visible && "block")}
        data-slot="checkbox-icon"
      />
    </CheckboxPrimitive.Indicator>
  )
}
`)
  })

  it("adds the import before local imports", () => {
    const code = `import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"

const items = [
  { title: "Home", icon: <IconPlaceholder lucide="HouseIcon" tabler="IconHome" hugeicons="Home01Icon" phosphor="HouseIcon" remixicon="RiHomeLine" /> },
]

export function Demo() {
  return <Button><IconPlaceholder lucide="PlusIcon" tabler="IconPlus" hugeicons="PlusSignIcon" phosphor="PlusIcon" remixicon="RiAddLine" data-icon="inline-start" /> Add</Button>
}
`
    expect(
      toPhosphorIcons(code)
    ).toBe(`import { HouseIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

const items = [
  { title: "Home", icon: <HouseIcon /> },
]

export function Demo() {
  return <Button><PlusIcon data-icon="inline-start" /> Add</Button>
}
`)
  })

  it("keeps a separate local import group intact", () => {
    const code = `import * as React from "react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export const icon = <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" className="fill-current" />
`
    expect(
      toPhosphorIcons(code)
    ).toBe(`import { XIcon } from "@phosphor-icons/react"
import * as React from "react"

export const icon = <XIcon className="fill-current" />
`)
  })

  it("wraps a long import", () => {
    const names = ["Archive", "Bell", "Calendar", "Gear", "House", "Tray"]
    const code = `import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export const icons = [
${names.map((name) => `  <IconPlaceholder lucide="${name}Icon" tabler="Icon${name}" hugeicons="${name}Icon" phosphor="${name}Icon" remixicon="Ri${name}Line" key="${name}" />,`).join("\n")}
]
`
    expect(toPhosphorIcons(code).split("\n").slice(0, 9)).toEqual([
      "import {",
      "  ArchiveIcon,",
      "  BellIcon,",
      "  CalendarIcon,",
      "  GearIcon,",
      "  HouseIcon,",
      "  TrayIcon,",
      '} from "@phosphor-icons/react"',
      "",
    ])
  })

  it("leaves code without placeholders as it is", () => {
    const code = `import { XIcon } from "@phosphor-icons/react"\n\nexport const x = <XIcon />\n`
    expect(usesIconPlaceholders(code)).toBe(false)
    expect(toPhosphorIcons(code)).toBe(code)
  })
})

describe("toIcons", () => {
  it("writes the icons of another library", () => {
    expect(toIcons(component, "lucide")).toContain(
      'import { CheckIcon, MinusIcon } from "lucide-react"'
    )
    expect(toIcons(component, "remixicon")).toContain("<RiCheckLine />")
  })

  it("wraps HugeIcons icons in their component", () => {
    const code = toIcons(component, "hugeicons")
    expect(
      code
    ).toContain(`import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cva } from "class-variance-authority"`)
    expect(code).toContain(
      "<HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />"
    )
    expect(code).toContain(`<HugeiconsIcon
        icon={MinusSignIcon}
        strokeWidth={2}
        className={cn("size-3.5", visible && "block")}
        data-slot="checkbox-icon"
      />`)
  })
})
