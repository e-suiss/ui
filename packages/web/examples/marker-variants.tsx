import { Marker, MarkerContent } from "@/components/ui/marker"

export default function MarkerVariants() {
  return (
    <div className="w-96">
      <div className="flex flex-col gap-6">
        <Marker variant="default">
          <MarkerContent>Default</MarkerContent>
        </Marker>
        <Marker variant="separator">
          <MarkerContent>Today</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerContent>Earlier messages</MarkerContent>
        </Marker>
      </div>
    </div>
  )
}
