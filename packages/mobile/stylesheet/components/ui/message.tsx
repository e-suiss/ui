import * as React from "react"
import { StyleSheet, View, type ViewProps } from "react-native"
import { BubbleAlignContext, BubbleGroup } from "@/components/ui/bubble"
import { IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type MessageAlign = "start" | "end"

const MessageContext = React.createContext<{
  align: MessageAlign
  footer: boolean
}>({ align: "start", footer: false })

const styles = StyleSheet.create({
  group: { minWidth: 0, flexDirection: "column", gap: 8 },
  message: { position: "relative", width: "100%", minWidth: 0, gap: 8 },
  avatar: {
    minWidth: 32,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    overflow: "hidden",
    borderRadius: radius.full,
  },
  content: { minWidth: 0, flex: 1, gap: 10 },
  meta: {
    minWidth: 0,
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
})

function wrapText(children: React.ReactNode) {
  const output: React.ReactNode[] = []
  let run: (string | number)[] = []
  const flush = () => {
    if (run.length === 0) return
    output.push(<Text key={`text-${output.length}`}>{run.join("")}</Text>)
    run = []
  }
  for (const child of React.Children.toArray(children)) {
    if (typeof child === "string" || typeof child === "number") {
      run.push(child)
    } else {
      flush()
      output.push(child)
    }
  }
  flush()
  return output
}

function hasFooter(children: React.ReactNode) {
  let found = false
  React.Children.forEach(children, (child) => {
    if (
      !React.isValidElement<{ children?: React.ReactNode }>(child) ||
      child.type !== MessageContent
    ) {
      return
    }
    React.Children.forEach(child.props.children, (part) => {
      if (React.isValidElement(part) && part.type === MessageFooter) {
        found = true
      }
    })
  })
  return found
}

function MessageGroup({ style, ...props }: ViewProps) {
  return <View style={[styles.group, style]} {...props} />
}

function Message({
  style,
  align = "start",
  children,
  ...props
}: ViewProps & { align?: MessageAlign }) {
  const footer = hasFooter(children)
  const context = React.useMemo(() => ({ align, footer }), [align, footer])
  return (
    <MessageContext.Provider value={context}>
      <BubbleAlignContext.Provider value={align}>
        <View
          style={[
            styles.message,
            { flexDirection: align === "end" ? "row-reverse" : "row" },
            style,
          ]}
          {...props}
        >
          {children}
        </View>
      </BubbleAlignContext.Provider>
    </MessageContext.Provider>
  )
}

function MessageAvatar({ style, ...props }: ViewProps) {
  const { colors } = useTheme()
  const { footer } = React.useContext(MessageContext)
  return (
    <View
      style={[
        styles.avatar,
        { backgroundColor: colors.muted },
        footer && { transform: [{ translateY: -32 }] },
        style,
      ]}
      {...props}
    />
  )
}

function MessageContent({
  style,
  ...props
}: React.ComponentProps<typeof BubbleGroup>) {
  const { align } = React.useContext(MessageContext)
  return (
    <BubbleGroup
      style={[
        styles.content,
        { alignItems: align === "end" ? "flex-end" : "flex-start" },
        style,
      ]}
      {...props}
    />
  )
}

function MessageMeta({
  style,
  children,
  end,
  ...props
}: ViewProps & { end?: boolean }) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...fontSize.xs, color: colors.mutedForeground }}
    >
      <IconSizeContext.Provider value={14}>
        <View
          style={[styles.meta, end && { justifyContent: "flex-end" }, style]}
          {...props}
        >
          {wrapText(children)}
        </View>
      </IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

function MessageHeader(props: ViewProps) {
  return <MessageMeta {...props} />
}

function MessageFooter(props: ViewProps) {
  const { align } = React.useContext(MessageContext)
  return <MessageMeta end={align === "end"} {...props} />
}

export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
}
