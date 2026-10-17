import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"

export default function TraceSheet() {
  return (
    <Trace className="max-w-sm">
      <Sheet>
        <SheetTrigger>
          <TraceLine>
            <TraceIcon>
              <IconPlaceholder
                lucide="FolderSearchIcon"
                tabler="IconFolderSearch"
                hugeicons="FolderSearchIcon"
                phosphor="FolderOpenIcon"
                remixicon="RiFolderOpenLine"
              />
            </TraceIcon>
            <TraceTitle>Explored 4 files</TraceTitle>
            <TraceIcon>
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
              />
            </TraceIcon>
          </TraceLine>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Explored 4 files</SheetTitle>
            <SheetDescription>
              Files read while preparing the response.
            </SheetDescription>
          </SheetHeader>
          <ul className="flex flex-col gap-2 px-6 font-mono text-xs">
            <li>apps/web/lib/docs.ts</li>
            <li>apps/web/lib/components.ts</li>
            <li>apps/web/next.config.mjs</li>
            <li>apps/web/package.json</li>
          </ul>
        </SheetContent>
      </Sheet>
    </Trace>
  )
}
