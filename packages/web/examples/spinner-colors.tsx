import { Spinner } from "@/components/ui/spinner"

export default function SpinnerColors() {
  return (
    <div className="flex items-center gap-4">
      <Spinner className="text-primary size-6" />
      <Spinner className="text-muted-foreground size-6" />
      <Spinner className="text-destructive size-6" />
    </div>
  )
}
