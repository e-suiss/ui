import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export default function ProgressWithLabel() {
  return (
    <Progress className="w-80" value={42}>
      <ProgressLabel>Uploading files</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}
