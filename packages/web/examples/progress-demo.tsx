import { Progress } from "@/components/ui/progress"

export default function ProgressDemo() {
  return (
    <div className="w-80">
      <Progress value={60} aria-label="Upload progress" />
    </div>
  )
}
