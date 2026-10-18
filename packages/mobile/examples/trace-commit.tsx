import {
  FilePlusIcon,
  GitCommitIcon,
  NotePencilIcon,
} from "phosphor-react-native"
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

const files = [
  { icon: NotePencilIcon, path: "app/login/page.tsx", stat: "+12 −4" },
  { icon: NotePencilIcon, path: "lib/auth/redirect.ts", stat: "+31 −9" },
  { icon: FilePlusIcon, path: "lib/auth/redirect.test.ts", stat: "+58" },
]

export default function TraceCommit() {
  return (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine>
          <TraceIcon>
            <Icon as={GitCommitIcon} />
          </TraceIcon>
          <TraceTitle>Committed a1b2c3: Fix the login redirect</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          {files.map((file) => (
            <TraceLine key={file.path}>
              <TraceIcon>
                <Icon as={file.icon} />
              </TraceIcon>
              <TraceTitle>{file.path}</TraceTitle>
              <TraceDescription>{file.stat}</TraceDescription>
            </TraceLine>
          ))}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
