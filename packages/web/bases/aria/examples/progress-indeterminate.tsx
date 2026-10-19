import { Progress, ProgressLabel } from "@/components/ui/progress"

export default function ProgressIndeterminate() {
  return (
    <Progress className="w-80" isIndeterminate>
      <ProgressLabel>Preparing export</ProgressLabel>
    </Progress>
  )
}
