import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command"

export default function CommandEmptyExample() {
  return (
    <Command className="w-140 ring-foreground/5 shadow-md ring-1">
      <CommandInput placeholder="Search projects..." />
      <CommandList>
        <CommandEmpty>No projects found.</CommandEmpty>
      </CommandList>
    </Command>
  )
}
