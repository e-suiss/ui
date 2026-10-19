import { Slider } from "@/components/ui/slider"

export default function SliderVertical() {
  return (
    <div className="flex h-48 w-72 justify-center">
      <Slider
        defaultValue={[50]}
        min={0}
        max={100}
        step={1}
        orientation="vertical"
        aria-label="Volume"
      />
    </div>
  )
}
