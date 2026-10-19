import { Marker, MarkerContent } from "@/components/ui/marker"

export default function MarkerWithLink() {
  return (
    <Marker className="w-96">
      <MarkerContent>
        This chat was archived. <a href="#restore">Restore it</a>
      </MarkerContent>
    </Marker>
  )
}
