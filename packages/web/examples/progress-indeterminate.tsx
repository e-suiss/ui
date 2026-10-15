import { Progress, ProgressLabel } from "@/components/ui/progress"

export default function ProgressIndeterminate() {
  return (
    <div className="w-80">
      <Progress value={null}>
        <ProgressLabel>Preparing export</ProgressLabel>
      </Progress>
    </div>
  )
}
