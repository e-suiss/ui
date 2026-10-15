import { Switch } from "@/components/ui/switch"

export default function SwitchSizes() {
  return (
    <div className="flex items-center gap-4">
      <Switch size="sm" defaultSelected aria-label="Wi-Fi" />
      <Switch size="default" defaultSelected aria-label="Bluetooth" />
    </div>
  )
}
