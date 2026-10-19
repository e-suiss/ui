import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export default function MarkerWithIcon() {
  return (
    <div className="flex w-96 flex-col gap-6">
      <Marker>
        <MarkerIcon>
          <IconPlaceholder
            lucide="InfoIcon"
            tabler="IconInfoCircle"
            hugeicons="InformationCircleIcon"
            phosphor="InfoIcon"
            remixicon="RiInformationLine"
          />
        </MarkerIcon>
        <MarkerContent>Maya joined the conversation</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerIcon>
          <IconPlaceholder
            lucide="CalendarIcon"
            tabler="IconCalendar"
            hugeicons="Calendar01Icon"
            phosphor="CalendarBlankIcon"
            remixicon="RiCalendarLine"
          />
        </MarkerIcon>
        <MarkerContent>March 12</MarkerContent>
      </Marker>
    </div>
  )
}
