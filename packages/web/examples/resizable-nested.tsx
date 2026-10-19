import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function ResizableNested() {
  return (
    <div className="h-80 w-[36rem] overflow-hidden rounded-2xl border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="30%" minSize="20%">
          <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
            Files
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="70%">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="65%">
              <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
                Editor
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="35%">
              <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
                Terminal
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
