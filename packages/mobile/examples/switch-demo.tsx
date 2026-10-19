import * as React from "react"
import { Switch } from "@/components/ui/switch"

export default function SwitchDemoExample() {
  const [checked, setChecked] = React.useState(false)
  return <Switch checked={checked} onCheckedChange={setChecked} />
}
