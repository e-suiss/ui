import {
  SearchPicker,
  type SearchPickerItem,
} from "@/components/patterns/search-picker"

const cities: SearchPickerItem[] = [
  { value: "nyc", label: "New York", group: "Americas" },
  { value: "chi", label: "Chicago", group: "Americas" },
  { value: "sao", label: "São Paulo", group: "Americas" },
  { value: "lon", label: "London", group: "Europe" },
  { value: "ber", label: "Berlin", group: "Europe" },
  { value: "ist", label: "Istanbul", group: "Europe" },
  { value: "tyo", label: "Tokyo", group: "Asia" },
  { value: "sin", label: "Singapore", group: "Asia" },
]

export default function SearchPickerGrouped() {
  return (
    <SearchPicker
      items={cities}
      placeholder="Select a city"
      searchPlaceholder="Search cities..."
      emptyText="No city found."
      accessibilityLabel="City"
      className="w-56"
    />
  )
}
