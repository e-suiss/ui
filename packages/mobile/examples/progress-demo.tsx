import * as React from "react"
import { Progress } from "@/components/ui/progress"

export default function ProgressDemoExample() {
  const [value, setValue] = React.useState(13)
  React.useEffect(() => {
    const timer = setTimeout(() => setValue(66), 500)
    return () => clearTimeout(timer)
  }, [])
  return <Progress value={value} />
}
