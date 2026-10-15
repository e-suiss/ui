import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const themes = [
  {
    value: "light",
    label: "Light",
    icon: (
      <IconPlaceholder
        lucide="SunIcon"
        tabler="IconSun"
        hugeicons="Sun03Icon"
        phosphor="SunIcon"
        remixicon="RiSunLine"
      />
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <IconPlaceholder
        lucide="MoonIcon"
        tabler="IconMoon"
        hugeicons="MoonIcon"
        phosphor="MoonIcon"
        remixicon="RiMoonLine"
      />
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <IconPlaceholder
        lucide="GlobeIcon"
        tabler="IconWorld"
        hugeicons="Globe02Icon"
        phosphor="GlobeIcon"
        remixicon="RiGlobalLine"
      />
    ),
  },
]

export default function SelectWithIcons() {
  return (
    <Select aria-label="Theme" defaultValue="system">
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {themes.map(({ value, label, icon }) => (
          <SelectItem key={value} value={value}>
            {icon}
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
