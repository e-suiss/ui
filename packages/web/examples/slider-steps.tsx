import { Slider } from "@/components/ui/slider"

export default function SliderSteps() {
  return (
    <div className="w-72">
      <Slider
        defaultValue={[40]}
        min={0}
        max={100}
        step={10}
        aria-label="Brightness"
      />
    </div>
  )
}
