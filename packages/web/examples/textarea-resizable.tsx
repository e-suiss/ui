import * as React from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaResizable() {
  const ref = React.useRef<HTMLTextAreaElement>(null)
  const [rows, setRows] = React.useState(0)

  React.useEffect(() => {
    const area = ref.current
    if (!area) return
    const measure = () => {
      const style = getComputedStyle(area)
      const padding =
        Number.parseFloat(style.paddingTop) +
        Number.parseFloat(style.paddingBottom)
      const line = Number.parseFloat(style.lineHeight)
      setRows(Math.floor((area.clientHeight - padding) / line))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(area)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex w-80 flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <Label htmlFor="campaign-inside">Campaign copy</Label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {rows} rows
        </span>
      </div>
      <Textarea
        placeholder="Type your message here."
        rows={5}
        defaultValue="Weekend sale on every grill. 15% off Saturday and Sunday from 12:00 to 16:00, including delivery orders."
        ref={ref}
        id="campaign-inside"
        resizable="inside"
        aria-describedby="campaign-inside-hint"
      />
      <p id="campaign-inside-hint" className="text-xs text-muted-foreground">
        Drag the bottom corner to resize. Double-click it to reset.
      </p>
    </div>
  )
}
