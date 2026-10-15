import { Fragment } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const timezones = [
  {
    label: "North America",
    items: [
      { value: "est", label: "Eastern Time" },
      { value: "cst", label: "Central Time" },
      { value: "pst", label: "Pacific Time" },
    ],
  },
  {
    label: "Europe",
    items: [
      { value: "gmt", label: "Greenwich Mean Time" },
      { value: "cet", label: "Central European Time" },
      { value: "eet", label: "Eastern European Time" },
    ],
  },
]

export default function SelectGrouped() {
  return (
    <Select aria-label="Timezone" defaultValue="cet">
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        {timezones.map((group, index) => (
          <Fragment key={group.label}>
            {index > 0 && <SelectSeparator />}
            <SelectGroup>
              <SelectLabel>{group.label}</SelectLabel>
              {group.items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </Fragment>
        ))}
      </SelectContent>
    </Select>
  )
}
