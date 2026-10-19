import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function ResizableVertical() {
  return (
    <div className="h-80 w-[36rem] overflow-hidden rounded-2xl border">
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize="30%" minSize="20%">
          <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
            Sidebar
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="70%">
          <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
            Content
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
