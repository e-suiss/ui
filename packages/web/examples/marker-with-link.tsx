import { Marker, MarkerContent } from "@/components/ui/marker"

export default function MarkerWithLink() {
  return (
    <div className="w-96">
      <Marker>
        <MarkerContent>
          This chat was archived. <a href="#restore">Restore it</a>
        </MarkerContent>
      </Marker>
    </div>
  )
}
