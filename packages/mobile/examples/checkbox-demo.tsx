import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"

export default function CheckboxDemoExample() {
  const [checked, setChecked] = React.useState(false)
  return <Checkbox checked={checked} onCheckedChange={setChecked} />
}
