import { CalendarBlankIcon, InfoIcon } from "@phosphor-icons/react"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export default function MarkerWithIcon() {
  return (
    <div className="w-96">
      <div className="flex flex-col gap-6">
        <Marker>
          <MarkerIcon>
            <InfoIcon />
          </MarkerIcon>
          <MarkerContent>Maya joined the conversation</MarkerContent>
        </Marker>
        <Marker variant="separator">
          <MarkerIcon>
            <CalendarBlankIcon />
          </MarkerIcon>
          <MarkerContent>March 12</MarkerContent>
        </Marker>
      </div>
    </div>
  )
}
