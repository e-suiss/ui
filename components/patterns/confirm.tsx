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

type AdaptiveAlertContextProps = {
  isMobile: boolean
}

const AdaptiveAlertContext =
  React.createContext<AdaptiveAlertContextProps | null>(null)

function useAdaptiveAlert() {
  const context = React.useContext(AdaptiveAlertContext)

  if (!context) {
    throw new Error("useAdaptiveAlert must be used within a <AdaptiveAlert />")
  }

  return context
}

function AdaptiveAlert({
  dismissible = false,
  ...props
}: React.ComponentProps<typeof AlertSheet>) {
  const isMobile = useIsMobile()

  return (
    <AdaptiveAlertContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <AlertSheet
          data-slot="adaptive-alert"
          dismissible={dismissible}
          {...props}
        />
      ) : (
        <AlertDialog data-slot="adaptive-alert" {...props} />
      )}
    </AdaptiveAlertContext.Provider>
  )
}

function AdaptiveAlertTrigger(
  props: React.ComponentProps<typeof AlertDialogTrigger>
) {
  const { isMobile } = useAdaptiveAlert()
  const Trigger = isMobile ? AlertSheetTrigger : AlertDialogTrigger

  return <Trigger data-slot="adaptive-alert-trigger" {...props} />
}

function AdaptiveAlertContent({
  size,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogContent>) {
  const { isMobile } = useAdaptiveAlert()

  if (!isMobile) {
    return (
      <AlertDialogContent
        data-slot="adaptive-alert-content"
        size={size}
        {...props}
      >
        {children}
      </AlertDialogContent>
    )
  }

  const nodes = React.Children.toArray(children)
  const footer = nodes.find(
    (node): node is React.ReactElement<{ children?: React.ReactNode }> =>
      React.isValidElement(node) && node.type === AdaptiveAlertFooter
  )
  const buttons = React.Children.toArray(footer?.props.children)
  const isCancel = (node: React.ReactNode) =>
    React.isValidElement(node) && node.type === AdaptiveAlertCancel

  return (
    <AlertSheetContent data-slot="adaptive-alert-content" {...props}>
      <AlertSheetGroup>
        {nodes.filter((node) => node !== footer)}
        {buttons.filter((node) => !isCancel(node))}
      </AlertSheetGroup>
      {buttons.filter(isCancel)}
    </AlertSheetContent>
  )
}

function AdaptiveAlertHeader(props: React.ComponentProps<"div">) {
  const { isMobile } = useAdaptiveAlert()
  const Header = isMobile ? AlertSheetHeader : AlertDialogHeader

  return <Header data-slot="adaptive-alert-header" {...props} />
}

function AdaptiveAlertFooter(props: React.ComponentProps<"div">) {
  return <AlertDialogFooter data-slot="adaptive-alert-footer" {...props} />
}

function AdaptiveAlertTitle(
  props: React.ComponentProps<typeof AlertDialogTitle>
) {
  const { isMobile } = useAdaptiveAlert()
  const Title = isMobile ? AlertSheetTitle : AlertDialogTitle

  return <Title data-slot="adaptive-alert-title" {...props} />
}

function AdaptiveAlertDescription(
  props: React.ComponentProps<typeof AlertDialogDescription>
) {
  const { isMobile } = useAdaptiveAlert()
  const Description = isMobile ? AlertSheetDescription : AlertDialogDescription

  return <Description data-slot="adaptive-alert-description" {...props} />
}

function AdaptiveAlertAction(
  props: React.ComponentProps<typeof AlertSheetAction>
) {
  const { isMobile } = useAdaptiveAlert()
  const Action = isMobile ? AlertSheetAction : AlertDialogAction

  return <Action data-slot="adaptive-alert-action" {...props} />
}

function AdaptiveAlertCancel(
  props: React.ComponentProps<typeof AlertSheetCancel>
) {
  const { isMobile } = useAdaptiveAlert()
  const Cancel = isMobile ? AlertSheetCancel : AlertDialogCancel

  return <Cancel data-slot="adaptive-alert-cancel" {...props} />
}

export {
  AdaptiveAlert,
  AdaptiveAlertAction,
  AdaptiveAlertCancel,
  AdaptiveAlertContent,
  AdaptiveAlertDescription,
  AdaptiveAlertFooter,
  AdaptiveAlertHeader,
  AdaptiveAlertTitle,
  AdaptiveAlertTrigger,
}
