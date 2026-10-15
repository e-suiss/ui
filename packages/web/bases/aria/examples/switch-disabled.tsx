import { Switch } from "@/components/ui/switch"

export default function SwitchDisabled() {
  return (
    <div className="flex items-center gap-4">
      <Switch isDisabled aria-label="Wi-Fi" />
      <Switch isDisabled defaultSelected aria-label="Bluetooth" />
    </div>
  )
}
