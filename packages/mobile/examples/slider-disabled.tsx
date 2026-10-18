import { Slider } from "@/components/ui/slider"

export default function SliderDisabled() {
  return (
    <Slider
      defaultValue={40}
      max={100}
      step={1}
      accessibilityLabel="Volume"
      disabled
    />
  )
}
