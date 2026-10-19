import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function ResizableDemo() {
  return (
    <div className="h-80 w-[36rem] overflow-hidden rounded-2xl border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="50%">
          <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
            Inbox
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="50%">
          <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
            Message
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
