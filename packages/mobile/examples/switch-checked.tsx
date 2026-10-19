import * as React from "react"
import { Switch } from "@/components/ui/switch"

export default function SwitchChecked() {
  const [checked, setChecked] = React.useState(true)
  return <Switch checked={checked} onCheckedChange={setChecked} />
}
