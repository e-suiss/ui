import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command"

export default function CommandEmptyExample() {
  return (
    <div className="w-140">
      <Command className="ring-label/5 shadow-md ring-1">
        <CommandInput placeholder="Search projects..." />
        <CommandList>
          <CommandEmpty>No projects found.</CommandEmpty>
        </CommandList>
      </Command>
    </div>
  )
}
