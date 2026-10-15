import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

function Pane({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
      {label}
    </div>
  )
}

export default function ResizableDemo() {
  return (
    <div className="h-80 w-[36rem] overflow-hidden rounded-2xl border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="50%">
          <Pane label="Inbox" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="50%">
          <Pane label="Message" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
