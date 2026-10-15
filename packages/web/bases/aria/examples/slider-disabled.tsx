import { Slider } from "@/components/ui/slider"

export default function SliderDisabled() {
  return (
    <div className="w-72">
      <Slider
        defaultValue={[50]}
        minValue={0}
        maxValue={100}
        step={1}
        isDisabled
        aria-label="Volume"
      />
    </div>
  )
}
