import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function InputSizes() {
  return (
    <div className="flex w-80 flex-col gap-3">
      <div className="flex items-center gap-2">
        <Input type="text" size="sm" placeholder="Small" />
        <Button size="sm">Save</Button>
      </div>
      <div className="flex items-center gap-2">
        <Input type="text" size="md" placeholder="Medium" />
        <Button>Save</Button>
      </div>
      <div className="flex items-center gap-2">
        <Input type="text" size="default" placeholder="Default" />
        <Button size="lg">Save</Button>
      </div>
    </div>
  )
}
