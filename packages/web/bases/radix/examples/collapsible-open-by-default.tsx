import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function CollapsibleOpenByDefault() {
  return (
    <Collapsible defaultOpen className="flex w-80 flex-col gap-2">
      <div className="flex items-center justify-between gap-4 px-3">
        <span className="text-sm font-medium">
          @ademceper starred 3 repositories
        </span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Toggle list">
            <IconPlaceholder
              lucide="ChevronsUpDownIcon"
              tabler="IconSelector"
              hugeicons="UnfoldMoreIcon"
              phosphor="CaretUpDownIcon"
              remixicon="RiExpandUpDownLine"
            />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="bg-muted rounded-2xl px-4 py-2 text-sm">acme/ui</div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="bg-muted rounded-2xl px-4 py-2 text-sm">acme/docs</div>
        <div className="bg-muted rounded-2xl px-4 py-2 text-sm">acme/cli</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
