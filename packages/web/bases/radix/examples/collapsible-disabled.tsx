import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const repositories = ["acme/ui", "acme/docs", "acme/cli"]

export default function CollapsibleDisabled() {
  return (
    <div className="w-80">
      <Collapsible disabled className="flex flex-col gap-2">
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
        <div className="bg-muted rounded-2xl px-4 py-2 text-sm">
          {repositories[0]}
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          {repositories.slice(1).map((repository) => (
            <div
              key={repository}
              className="bg-muted rounded-2xl px-4 py-2 text-sm"
            >
              {repository}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
