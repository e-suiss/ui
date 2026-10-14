import { cn } from "cn"
import * as React from "react"
import { View, type ViewProps } from "react-native"
import { BubbleAlignContext, BubbleGroup } from "@/components/ui/bubble"
import { IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

type MessageAlign = "start" | "end"

const MessageContext = React.createContext<{
  align: MessageAlign
  footer: boolean
}>({ align: "start", footer: false })

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

function MessageGroup({ className, ...props }: ViewProps) {
  return <View className={cn("min-w-0 flex-col gap-2", className)} {...props} />
}

function Message({
  className,
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
          className={cn(
            "relative w-full min-w-0 gap-2",
            align === "end" ? "flex-row-reverse" : "flex-row",
            className
          )}
          {...props}
        >
          {children}
        </View>
      </BubbleAlignContext.Provider>
    </MessageContext.Provider>
  )
}

function MessageAvatar({ className, ...props }: ViewProps) {
  const { footer } = React.useContext(MessageContext)
  return (
    <View
      className={cn(
        "min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-surface-secondary",
        footer && "-translate-y-8",
        className
      )}
      {...props}
    />
  )
}

function MessageContent({
  className,
  ...props
}: React.ComponentProps<typeof BubbleGroup>) {
  const { align } = React.useContext(MessageContext)
  return (
    <BubbleGroup
      className={cn(
        "min-w-0 flex-1 gap-2.5",
        align === "end" ? "items-end" : "items-start",
        className
      )}
      {...props}
    />
  )
}

function MessageHeader({ className, children, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-xs text-label-secondary">
      <IconClassContext.Provider value="size-3.5">
        <View
          className={cn(
            "min-w-0 max-w-full flex-row items-center px-3.5",
            className
          )}
          {...props}
        >
          {wrapText(children)}
        </View>
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

function MessageFooter({ className, children, ...props }: ViewProps) {
  const { align } = React.useContext(MessageContext)
  return (
    <TextClassContext.Provider value="text-xs text-label-secondary">
      <IconClassContext.Provider value="size-3.5">
        <View
          className={cn(
            "min-w-0 max-w-full flex-row items-center px-3.5",
            align === "end" && "justify-end",
            className
          )}
          {...props}
        >
          {wrapText(children)}
        </View>
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
}
