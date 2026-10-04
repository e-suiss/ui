"use client"

import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { useIsMobile } from "@/hooks/use-mobile"

type ConfirmContextProps = {
  isMobile: boolean
}

const ConfirmContext = React.createContext<ConfirmContextProps | null>(null)

function useConfirm() {
  const context = React.useContext(ConfirmContext)

  if (!context) {
    throw new Error("useConfirm must be used within a <Confirm />")
  }

  return context
}

function Confirm({
  dismissible = false,
  ...props
}: React.ComponentProps<typeof AlertSheet>) {
  const isMobile = useIsMobile()

  return (
    <ConfirmContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <AlertSheet data-slot="confirm" dismissible={dismissible} {...props} />
      ) : (
        <AlertDialog data-slot="confirm" {...props} />
      )}
    </ConfirmContext.Provider>
  )
}

function ConfirmTrigger(
  props: React.ComponentProps<typeof AlertDialogTrigger>
) {
  const { isMobile } = useConfirm()
  const Trigger = isMobile ? AlertSheetTrigger : AlertDialogTrigger

  return <Trigger data-slot="confirm-trigger" {...props} />
}

function ConfirmContent({
  size,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogContent>) {
  const { isMobile } = useConfirm()

  if (!isMobile) {
    return (
      <AlertDialogContent data-slot="confirm-content" size={size} {...props}>
        {children}
      </AlertDialogContent>
    )
  }

  const nodes = React.Children.toArray(children)
  const footer = nodes.find(
    (node): node is React.ReactElement<{ children?: React.ReactNode }> =>
      React.isValidElement(node) && node.type === ConfirmFooter
  )
  const buttons = React.Children.toArray(footer?.props.children)
  const isCancel = (node: React.ReactNode) =>
    React.isValidElement(node) && node.type === ConfirmCancel

  return (
    <AlertSheetContent data-slot="confirm-content" {...props}>
      <AlertSheetGroup>
        {nodes.filter((node) => node !== footer)}
        {buttons.filter((node) => !isCancel(node))}
      </AlertSheetGroup>
      {buttons.filter(isCancel)}
    </AlertSheetContent>
  )
}

function ConfirmHeader(props: React.ComponentProps<"div">) {
  const { isMobile } = useConfirm()
  const Header = isMobile ? AlertSheetHeader : AlertDialogHeader

  return <Header data-slot="confirm-header" {...props} />
}

function ConfirmFooter(props: React.ComponentProps<"div">) {
  return <AlertDialogFooter data-slot="confirm-footer" {...props} />
}

function ConfirmTitle(props: React.ComponentProps<typeof AlertDialogTitle>) {
  const { isMobile } = useConfirm()
  const Title = isMobile ? AlertSheetTitle : AlertDialogTitle

  return <Title data-slot="confirm-title" {...props} />
}

function ConfirmDescription(
  props: React.ComponentProps<typeof AlertDialogDescription>
) {
  const { isMobile } = useConfirm()
  const Description = isMobile ? AlertSheetDescription : AlertDialogDescription

  return <Description data-slot="confirm-description" {...props} />
}

function ConfirmAction(props: React.ComponentProps<typeof AlertSheetAction>) {
  const { isMobile } = useConfirm()
  const Action = isMobile ? AlertSheetAction : AlertDialogAction

  return <Action data-slot="confirm-action" {...props} />
}

function ConfirmCancel(props: React.ComponentProps<typeof AlertSheetCancel>) {
  const { isMobile } = useConfirm()
  const Cancel = isMobile ? AlertSheetCancel : AlertDialogCancel

  return <Cancel data-slot="confirm-cancel" {...props} />
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
