import { Slider } from "@/components/ui/slider"

export default function SliderStep() {
  return (
    <Slider
      defaultValue={0.5}
      max={1}
      step={0.1}
      accessibilityLabel="Volume"
      min={0}
    />
  )
}
