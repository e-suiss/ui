import { Slider } from "@/components/ui/slider"

export default function SliderMultipleThumbs() {
  return (
    <Slider
      defaultValue={[10, 40, 80]}
      max={100}
      step={1}
      accessibilityLabel="Volume"
      thumbCollisionBehavior="swap"
    />
  )
}
