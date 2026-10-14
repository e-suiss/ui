import * as React from "react"
import { View, type ViewProps } from "react-native"
import {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetDescription,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetTitle,
  AlertSheetTrigger,
} from "@/components/ui/alert-sheet"

function Confirm({
  dismissible = false,
  ...props
}: React.ComponentProps<typeof AlertSheet>) {
  return <AlertSheet dismissible={dismissible} {...props} />
}

function ConfirmTrigger(props: React.ComponentProps<typeof AlertSheetTrigger>) {
  return <AlertSheetTrigger {...props} />
}

function ConfirmContent({
  children,
  ...props
}: React.ComponentProps<typeof AlertSheetContent>) {
  const nodes = React.Children.toArray(children)
  const footer = nodes.find(
    (node): node is React.ReactElement<{ children?: React.ReactNode }> =>
      React.isValidElement(node) && node.type === ConfirmFooter
  )
  const buttons = React.Children.toArray(footer?.props.children)
  const isCancel = (node: React.ReactNode) =>
    React.isValidElement(node) && node.type === ConfirmCancel

  return (
    <AlertSheetContent {...props}>
      <AlertSheetGroup>
        {nodes.filter((node) => node !== footer)}
        {buttons.filter((node) => !isCancel(node))}
      </AlertSheetGroup>
      {buttons.filter(isCancel)}
    </AlertSheetContent>
  )
}

function ConfirmHeader(props: React.ComponentProps<typeof AlertSheetHeader>) {
  return <AlertSheetHeader {...props} />
}

function ConfirmFooter({ style, ...props }: ViewProps) {
  return (
    <View style={[{ flexDirection: "column", gap: 8 }, style]} {...props} />
  )
}

function ConfirmTitle(props: React.ComponentProps<typeof AlertSheetTitle>) {
  return <AlertSheetTitle {...props} />
}

function ConfirmDescription(
  props: React.ComponentProps<typeof AlertSheetDescription>
) {
  return <AlertSheetDescription {...props} />
}

function ConfirmAction(props: React.ComponentProps<typeof AlertSheetAction>) {
  return <AlertSheetAction {...props} />
}

function ConfirmCancel(props: React.ComponentProps<typeof AlertSheetCancel>) {
  return <AlertSheetCancel {...props} />
}

export {
  Confirm,
  ConfirmAction,
  ConfirmCancel,
  ConfirmContent,
  ConfirmDescription,
  ConfirmFooter,
  ConfirmHeader,
  ConfirmTitle,
  ConfirmTrigger,
}
