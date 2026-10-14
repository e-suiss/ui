import * as React from "react"
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import type { RenderProp } from "@/components/primitives/types"
import { resolveStyle, useRender } from "@/components/primitives/use-render"
import {
  Button,
  ButtonStyleContext,
  type ButtonVariant,
} from "@/components/ui/button"
import { IconSizeContext } from "@/components/ui/icon"
import { Separator } from "@/components/ui/separator"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type ButtonGroupOrientation = "horizontal" | "vertical"

const styles = StyleSheet.create({
  root: { alignItems: "stretch", alignSelf: "flex-start" },
  horizontal: { flexDirection: "row" },
  vertical: { flexDirection: "column" },
  nested: { gap: 8 },
  text: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: radius.full,
    paddingHorizontal: 10,
  },
  separator: { position: "relative", zIndex: 10 },
  separatorHorizontal: { marginHorizontal: 9, marginBottom: -1, width: "auto" },
  separatorVertical: { marginVertical: 9, marginRight: -1 },
})

function positionStyle(
  orientation: ButtonGroupOrientation,
  first: boolean,
  last: boolean
): ViewStyle {
  if (orientation === "vertical") {
    const top = first ? radius["2xl"] : 0
    const bottom = last ? radius["2xl"] : 0
    return {
      borderTopLeftRadius: top,
      borderTopRightRadius: top,
      borderBottomLeftRadius: bottom,
      borderBottomRightRadius: bottom,
      ...(first ? null : { borderTopWidth: 0 }),
    }
  }
  const left = first ? radius.full : 0
  const right = last ? radius.full : 0
  return {
    borderTopLeftRadius: left,
    borderBottomLeftRadius: left,
    borderTopRightRadius: right,
    borderBottomRightRadius: right,
    ...(first ? null : { borderLeftWidth: 0 }),
  }
}

function joinedButtonStyle(style: ViewStyle) {
  return (variant: ButtonVariant) =>
    variant === "ghost" || variant === "plain" ? undefined : style
}

function withStyle(child: React.ReactElement, extra: ViewStyle) {
  const element = child as React.ReactElement<{ style?: unknown }>
  const current = element.props.style
  return React.cloneElement(element, {
    style:
      typeof current === "function"
        ? (state: unknown) => [extra, resolveStyle(current, state)]
        : [extra, current],
  })
}

function ButtonGroup({
  style,
  orientation = "horizontal",
  children,
  ...props
}: ViewProps & { orientation?: ButtonGroupOrientation }) {
  const items = React.Children.toArray(children).filter(React.isValidElement)
  const nested = items.some((child) => child.type === ButtonGroup)
  return (
    <View
      role="group"
      style={[
        styles.root,
        orientation === "vertical" ? styles.vertical : styles.horizontal,
        nested && styles.nested,
        style,
      ]}
      {...props}
    >
      {items.map((child, index) => {
        if (child.type === ButtonGroup || child.type === ButtonGroupSeparator) {
          return (
            <ButtonStyleContext.Provider key={child.key} value={undefined}>
              {child}
            </ButtonStyleContext.Provider>
          )
        }
        const position = positionStyle(
          orientation,
          index === 0,
          index === items.length - 1
        )
        return (
          <ButtonStyleContext.Provider
            key={child.key}
            value={joinedButtonStyle(position)}
          >
            {child.type === Button ? child : withStyle(child, position)}
          </ButtonStyleContext.Provider>
        )
      })}
    </View>
  )
}

function ButtonGroupText({
  style,
  render,
  ...props
}: ViewProps & {
  render?: RenderProp<Record<string, unknown>, Record<string, never>>
}) {
  const { colors } = useTheme()
  const element = useRender({
    defaultComponent: View,
    render,
    props: [
      {
        style: [styles.text, { backgroundColor: colors.control }, style],
      },
      props,
    ],
  })
  return (
    <TextStyleContext.Provider value={{ ...fontSize.sm, color: colors.label }}>
      <IconSizeContext.Provider value={16}>{element}</IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

function ButtonGroupSeparator({
  style,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  const { colors } = useTheme()
  return (
    <Separator
      orientation={orientation}
      style={(state): StyleProp<ViewStyle> => [
        styles.separator,
        { backgroundColor: colors.label, opacity: 0.2 },
        state.orientation === "horizontal"
          ? styles.separatorHorizontal
          : styles.separatorVertical,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText }
