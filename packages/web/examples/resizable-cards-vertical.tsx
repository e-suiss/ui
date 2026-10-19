import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ResizableCardsVertical() {
  const [layout, setLayout] = React.useState<Record<string, number>>({})

  return (
    <div className="h-80 w-[36rem]">
      <ResizablePanelGroup
        orientation="vertical"
        variant="cards"
        onLayoutChange={setLayout}
      >
        <ResizablePanel
          id="pos"
          defaultSize="50%"
          minSize="25%"
          collapsible
          collapsedSize="0%"
          collapsedThreshold="1%"
        >
          <div className="size-full p-2">
            <ScrollArea className="size-full">
              <div className="flex min-h-full flex-col items-center justify-center gap-3 p-3 text-center">
                <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground [&_svg]:size-6">
                  <IconPlaceholder
                    lucide="CalculatorIcon"
                    tabler="IconCashRegister"
                    hugeicons="CashierIcon"
                    phosphor="CashRegisterIcon"
                    remixicon="RiCalculatorLine"
                  />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold">Point of sale</p>
                  <p className="text-sm text-muted-foreground tabular-nums">
                    {layout.pos === undefined
                      ? ""
                      : `${Math.round(layout.pos)}%`}
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          id="kitchen"
          defaultSize="50%"
          minSize="25%"
          collapsible
          collapsedSize="0%"
          collapsedThreshold="1%"
        >
          <div className="size-full p-2">
            <ScrollArea className="size-full">
              <div className="flex min-h-full flex-col items-center justify-center gap-3 p-3 text-center">
                <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground [&_svg]:size-6">
                  <IconPlaceholder
                    lucide="CookingPotIcon"
                    tabler="IconSoup"
                    hugeicons="PotIcon"
                    phosphor="CookingPotIcon"
                    remixicon="RiBowlLine"
                  />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold">Kitchen display</p>
                  <p className="text-sm text-muted-foreground tabular-nums">
                    {layout.kitchen === undefined
                      ? ""
                      : `${Math.round(layout.kitchen)}%`}
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
