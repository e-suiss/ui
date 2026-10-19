import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"

export default function CheckboxChecked() {
  const [checked, setChecked] = React.useState(true)
  return <Checkbox checked={checked} onCheckedChange={setChecked} />
}
