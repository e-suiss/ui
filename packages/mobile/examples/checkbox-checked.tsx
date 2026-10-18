import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"

function CheckboxDemo({ initial = false }: { initial?: boolean }) {
  const [checked, setChecked] = React.useState(initial)
  return <Checkbox checked={checked} onCheckedChange={setChecked} />
}

export default function CheckboxChecked() {
  return <CheckboxDemo initial />
}
