import { Spinner } from "@/components/ui/spinner"

export default function SpinnerColors() {
  return (
    <div className="flex items-center gap-4">
      <Spinner className="text-accent size-6" />
      <Spinner className="text-label-secondary size-6" />
      <Spinner className="text-danger size-6" />
    </div>
  )
}
