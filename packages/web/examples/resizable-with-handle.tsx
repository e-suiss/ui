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

export default function ResizableWithHandle() {
  return (
    <div className="h-80 w-[36rem] overflow-hidden rounded-2xl border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="30%" minSize="20%">
          <Pane label="Sidebar" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="70%">
          <Pane label="Content" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
