import { Marker, MarkerContent } from "@/components/ui/marker"

export default function MarkerDemo() {
  return (
    <div className="w-96">
      <Marker>
        <MarkerContent>Conversation started</MarkerContent>
      </Marker>
    </div>
  )
}
