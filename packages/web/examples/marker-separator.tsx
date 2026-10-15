import { Marker, MarkerContent } from "@/components/ui/marker"

export default function MarkerSeparator() {
  return (
    <div className="w-96">
      <Marker variant="separator">
        <MarkerContent>Yesterday</MarkerContent>
      </Marker>
    </div>
  )
}
