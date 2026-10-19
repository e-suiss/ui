import { Marker, MarkerContent } from "@/components/ui/marker"

export default function MarkerSeparator() {
  return (
    <Marker variant="separator" className="w-96">
      <MarkerContent>Yesterday</MarkerContent>
    </Marker>
  )
}
