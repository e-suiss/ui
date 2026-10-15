import { Slider } from "@/components/ui/slider"

export default function SliderVertical() {
  return (
    <div className="w-72">
      <div className="flex h-48 justify-center">
        <Slider
          defaultValue={[50]}
          min={0}
          max={100}
          step={1}
          orientation="vertical"
          aria-label="Volume"
        />
      </div>
    </div>
  )
}
