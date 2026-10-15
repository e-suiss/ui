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
    <Stepper defaultValue={1} minValue={0} maxValue={10}>
      <StepperInput aria-label="Quantity" />
      <StepperGroup>
        <StepperDecrement />
        <StepperSeparator />
        <StepperIncrement />
      </StepperGroup>
    </Stepper>
  )
}
