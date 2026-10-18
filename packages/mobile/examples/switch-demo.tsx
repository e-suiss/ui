import * as React from "react"
import { Switch } from "@/components/ui/switch"

function SwitchDemo({ initial = false }: { initial?: boolean }) {
  const [checked, setChecked] = React.useState(initial)
  return <Switch checked={checked} onCheckedChange={setChecked} />
}

export default function SwitchDemoExample() {
  return <SwitchDemo />
}
