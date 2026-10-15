import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export default function ProgressWithLabel() {
  return (
    <div className="w-80">
      <Progress value={42}>
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}
