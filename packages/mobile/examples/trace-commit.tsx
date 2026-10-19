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
          <TraceLine>
            <TraceIcon>
              <Icon as={NotePencilIcon} />
            </TraceIcon>
            <TraceTitle>app/login/page.tsx</TraceTitle>
            <TraceDescription>+12 −4</TraceDescription>
          </TraceLine>
          <TraceLine>
            <TraceIcon>
              <Icon as={NotePencilIcon} />
            </TraceIcon>
            <TraceTitle>lib/auth/redirect.ts</TraceTitle>
            <TraceDescription>+31 −9</TraceDescription>
          </TraceLine>
          <TraceLine>
            <TraceIcon>
              <Icon as={FilePlusIcon} />
            </TraceIcon>
            <TraceTitle>lib/auth/redirect.test.ts</TraceTitle>
            <TraceDescription>+58</TraceDescription>
          </TraceLine>
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
