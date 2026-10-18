import {
  Stepper,
  StepperDecrement,
  StepperGroup,
  StepperIncrement,
  StepperInput,
  StepperSeparator,
} from "@/components/interactions/stepper"

export default function StepperDemo() {
  return (
    <Stepper defaultValue={1} min={0} max={10}>
      <StepperInput accessibilityLabel="Quantity" />
      <StepperGroup>
        <StepperDecrement />
        <StepperSeparator />
        <StepperIncrement />
      </StepperGroup>
    </Stepper>
  )
}
