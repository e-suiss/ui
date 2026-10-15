import { Slider } from "@/components/ui/slider"

export default function SliderDisabled() {
  return (
    <div className="w-72">
      <Slider
        defaultValue={[50]}
        min={0}
        max={100}
        step={1}
        disabled
        aria-label="Volume"
      />
    </div>
  )
}
