import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"

export default function TraceDialog() {
  return (
    <Trace className="max-w-sm">
      <Dialog>
        <DialogTrigger>
          <TraceLine>
            <TraceIcon>
              <IconPlaceholder
                lucide="GlobeIcon"
                tabler="IconWorld"
                hugeicons="Globe02Icon"
                phosphor="GlobeIcon"
                remixicon="RiGlobalLine"
              />
            </TraceIcon>
            <TraceTitle>Searched the web for cache keys</TraceTitle>
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
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Searched the web for cache keys</DialogTitle>
            <DialogDescription>
              Three results were used in the response.
            </DialogDescription>
          </DialogHeader>
          <Trace>
            <a
              href="https://nextjs.org/docs/app/guides/caching"
              target="_blank"
              rel="noreferrer"
            >
              <TraceLine>
                <TraceIcon>
                  <IconPlaceholder
                    lucide="GlobeIcon"
                    tabler="IconWorld"
                    hugeicons="Globe02Icon"
                    phosphor="GlobeIcon"
                    remixicon="RiGlobalLine"
                  />
                </TraceIcon>
                <TraceTitle>
                  Caching build outputs
                  <span className="sr-only"> (opens in a new tab)</span>
                </TraceTitle>
                <TraceIcon>
                  <IconPlaceholder
                    lucide="ArrowUpRightIcon"
                    tabler="IconArrowUpRight"
                    hugeicons="ArrowUpRight01Icon"
                    phosphor="ArrowUpRightIcon"
                    remixicon="RiArrowRightUpLine"
                  />
                </TraceIcon>
              </TraceLine>
            </a>
            <a
              href="https://nextjs.org/docs/app/api-reference/components/image"
              target="_blank"
              rel="noreferrer"
            >
              <TraceLine>
                <TraceIcon>
                  <IconPlaceholder
                    lucide="GlobeIcon"
                    tabler="IconWorld"
                    hugeicons="Globe02Icon"
                    phosphor="GlobeIcon"
                    remixicon="RiGlobalLine"
                  />
                </TraceIcon>
                <TraceTitle>
                  Image optimization reference
                  <span className="sr-only"> (opens in a new tab)</span>
                </TraceTitle>
                <TraceIcon>
                  <IconPlaceholder
                    lucide="ArrowUpRightIcon"
                    tabler="IconArrowUpRight"
                    hugeicons="ArrowUpRight01Icon"
                    phosphor="ArrowUpRightIcon"
                    remixicon="RiArrowRightUpLine"
                  />
                </TraceIcon>
              </TraceLine>
            </a>
            <a
              href="https://vercel.com/docs/deploy-hooks"
              target="_blank"
              rel="noreferrer"
            >
              <TraceLine>
                <TraceIcon>
                  <IconPlaceholder
                    lucide="GlobeIcon"
                    tabler="IconWorld"
                    hugeicons="Globe02Icon"
                    phosphor="GlobeIcon"
                    remixicon="RiGlobalLine"
                  />
                </TraceIcon>
                <TraceTitle>
                  Deploy hooks and cache keys
                  <span className="sr-only"> (opens in a new tab)</span>
                </TraceTitle>
                <TraceIcon>
                  <IconPlaceholder
                    lucide="ArrowUpRightIcon"
                    tabler="IconArrowUpRight"
                    hugeicons="ArrowUpRight01Icon"
                    phosphor="ArrowUpRightIcon"
                    remixicon="RiArrowRightUpLine"
                  />
                </TraceIcon>
              </TraceLine>
            </a>
          </Trace>
        </DialogContent>
      </Dialog>
    </Trace>
  )
}
