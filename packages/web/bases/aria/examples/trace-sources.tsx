import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export default function TraceSources() {
  return (
    <TraceCollapsible defaultExpanded className="w-full max-w-sm">
      <TraceCollapsibleTrigger>
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
          <TraceTitle>Used 3 sources</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          <a
            href="https://docs.astro.build/en/install-and-setup/"
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
                Install Astro | docs.astro.build
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
            href="https://www.npmjs.com/package/create-astro"
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
                create-astro | npmjs.com
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
            href="https://pnpm.io/settings#minimumreleaseage"
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
                Settings: minimumReleaseAge | pnpm.io
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
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
