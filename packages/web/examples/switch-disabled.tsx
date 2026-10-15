import { Switch } from "@/components/ui/switch"

export default function SwitchDisabled() {
  return (
    <div className="flex items-center gap-4">
      <Switch disabled aria-label="Wi-Fi" />
      <Switch disabled defaultChecked aria-label="Bluetooth" />
    </div>
  )
}
