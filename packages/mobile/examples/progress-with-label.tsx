import * as React from "react"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export default function ProgressWithLabel() {
  const [value, setValue] = React.useState(0)
  React.useEffect(() => {
    const timer = setInterval(() => {
      setValue((current) => (current >= 100 ? 0 : current + 10))
    }, 600)
    return () => clearInterval(timer)
  }, [])
  return (
    <Progress value={value}>
      <ProgressLabel>Uploading</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}
