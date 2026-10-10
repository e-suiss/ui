import * as React from "react"
import { View } from "react-native"
import { MenubarContext, type MenubarContextValue } from "./menu"
import type { BaseUIComponentProps, Orientation } from "./types"
import { useRender } from "./use-render"

interface MenubarState {
  orientation: Orientation
  modal: boolean
  hasSubmenuOpen: boolean
}

type MenubarProps = BaseUIComponentProps<typeof View, MenubarState> & {
  modal?: boolean | undefined
  disabled?: boolean | undefined
  orientation?: Orientation | undefined
}

function Menubar({
  modal = true,
  disabled = false,
  orientation = "horizontal",
  render,
  className,
  style,
  ref,
  ...elementProps
}: MenubarProps) {
  const [activeMenu, setActiveMenuState] = React.useState<string | null>(null)

  const setActiveMenu = React.useCallback((id: string) => {
    setActiveMenuState(id)
  }, [])

  const clearActiveMenu = React.useCallback((id: string) => {
    setActiveMenuState((previous) => (previous === id ? null : previous))
  }, [])

  const context = React.useMemo<MenubarContextValue>(
    () => ({
      activeMenu,
      setActiveMenu,
      clearActiveMenu,
      modal,
      disabled,
      orientation,
    }),
    [activeMenu, setActiveMenu, clearActiveMenu, modal, disabled, orientation]
  )

  const state = React.useMemo<MenubarState>(
    () => ({ orientation, modal, hasSubmenuOpen: activeMenu !== null }),
    [orientation, modal, activeMenu]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      { role: "menubar", accessibilityState: { disabled } },
      elementProps,
    ],
  })

  return (
    <MenubarContext.Provider value={context}>{element}</MenubarContext.Provider>
  )
}

Menubar.displayName = "Menubar"

export type { MenubarProps, MenubarState }
export { Menubar }
