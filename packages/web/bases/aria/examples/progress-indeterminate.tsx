import { Progress, ProgressLabel } from "@/components/ui/progress"

export default function ProgressIndeterminate() {
  return (
    <div className="w-80">
      <Progress isIndeterminate>
        <ProgressLabel>Preparing export</ProgressLabel>
      </Progress>
    </div>
  )
}
