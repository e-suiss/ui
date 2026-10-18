import { FileIcon, FolderIcon } from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export default function FileTreeDemo() {
  return (
    <Trace>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <Icon as={FolderIcon} />
            </TraceIcon>
            <TraceTitle>app</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            <TraceCollapsible defaultOpen>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <Icon as={FolderIcon} />
                  </TraceIcon>
                  <TraceTitle>settings</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
                  <TraceLine>
                    <TraceIcon>
                      <Icon as={FileIcon} />
                    </TraceIcon>
                    <TraceTitle>page.tsx</TraceTitle>
                    <TraceDescription>+24 −6</TraceDescription>
                  </TraceLine>
                  <TraceLine>
                    <TraceIcon>
                      <Icon as={FileIcon} />
                    </TraceIcon>
                    <TraceTitle>theme-toggle.tsx</TraceTitle>
                    <TraceDescription>+41</TraceDescription>
                  </TraceLine>
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceLine>
              <TraceIcon>
                <Icon as={FileIcon} />
              </TraceIcon>
              <TraceTitle>layout.tsx</TraceTitle>
              <TraceDescription>+3 −1</TraceDescription>
            </TraceLine>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
