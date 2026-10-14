import {
  Control,
  type ControlChangeEventDetails,
  type ControlChangeEventReason,
  type ControlProps,
  type ControlState,
} from "./field"

type RootProps = ControlProps

type RootState = ControlState

type ChangeEventReason = ControlChangeEventReason

type ChangeEventDetails = ControlChangeEventDetails

function Root(props: RootProps) {
  return <Control {...props} />
}

Root.displayName = "Input"

export type { ChangeEventDetails, ChangeEventReason, RootProps, RootState }
export { Root }
