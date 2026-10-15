import {
  Picker,
  PickerGroup,
  PickerItem,
  PickerSeparator,
} from "@/components/patterns/picker"

export default function PickerGrouped() {
  return (
    <Picker
      placeholder="Select a time zone"
      aria-label="Time zone"
      className="w-64"
    >
      <PickerGroup label="North America">
        <PickerItem value="est">Eastern Time</PickerItem>
        <PickerItem value="cst">Central Time</PickerItem>
        <PickerItem value="pst">Pacific Time</PickerItem>
      </PickerGroup>
      <PickerSeparator />
      <PickerGroup label="Europe">
        <PickerItem value="gmt">Greenwich Mean Time</PickerItem>
        <PickerItem value="cet">Central European Time</PickerItem>
        <PickerItem value="trt" disabled>
          Turkey Time
        </PickerItem>
      </PickerGroup>
    </Picker>
  )
}
