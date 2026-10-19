import { Progress, ProgressLabel } from "@/components/ui/progress"

export default function ProgressIndeterminate() {
  return (
    <Progress className="w-80" value={null}>
      <ProgressLabel>Preparing export</ProgressLabel>
    </Progress>
  )
}
