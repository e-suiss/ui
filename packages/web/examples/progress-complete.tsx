import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export default function ProgressComplete() {
  return (
    <Progress className="w-80" value={100}>
      <ProgressLabel>Uploading files</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}
