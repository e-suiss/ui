import { Slider } from "@/components/ui/slider"

export default function SliderRange() {
  return (
    <div className="w-72">
      <Slider
        defaultValue={[25, 75]}
        minValue={0}
        maxValue={100}
        step={1}
        aria-label="Price range"
      />
    </div>
  )
}
