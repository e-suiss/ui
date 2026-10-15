import { GlobeIcon, MoonIcon, SunIcon } from "@phosphor-icons/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const themes = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: GlobeIcon },
]

export default function SelectWithIcons() {
  return (
    <Select
      items={themes.map(({ value, label }) => ({ value, label }))}
      defaultValue="system"
    >
      <SelectTrigger aria-label="Theme" className="w-40">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {themes.map(({ value, label, icon: Icon }) => (
          <SelectItem key={value} value={value}>
            <Icon />
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
