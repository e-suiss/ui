import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AiAssistant() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assistant</CardTitle>
        <CardDescription>Ask anything about your workspace.</CardDescription>
        <CardAction>
          <Select
            defaultValue="balanced"
            items={{
              fast: "Fast",
              balanced: "Balanced",
              deep: "Deep",
            }}
          >
            <SelectTrigger size="sm" aria-label="Model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="deep">Deep</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <IconPlaceholder
              phosphor="ListChecksIcon"
              lucide="ListChecksIcon"
              tabler="IconListCheck"
              hugeicons="CheckListIcon"
              remixicon="RiListCheck3"
              data-icon="inline-start"
            />
            Plan my week
          </Button>
          <Button variant="outline" size="sm">
            <IconPlaceholder
              phosphor="EnvelopeSimpleIcon"
              lucide="MailIcon"
              tabler="IconMail"
              hugeicons="Mail01Icon"
              remixicon="RiMailLine"
              data-icon="inline-start"
            />
            Draft a reply
          </Button>
          <Button variant="outline" size="sm">
            <IconPlaceholder
              phosphor="ChartLineIcon"
              lucide="ChartLineIcon"
              tabler="IconChartLine"
              hugeicons="ChartLineData01Icon"
              remixicon="RiLineChartLine"
              data-icon="inline-start"
            />
            Summarize spending
          </Button>
        </div>
        <InputGroup>
          <InputGroupTextarea
            placeholder="Ask, plan, or write..."
            aria-label="Prompt"
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton size="icon-xs" aria-label="Attach file">
              <IconPlaceholder
                phosphor="PaperclipIcon"
                lucide="PaperclipIcon"
                tabler="IconPaperclip"
                hugeicons="Attachment01Icon"
                remixicon="RiAttachment2"
              />
            </InputGroupButton>
            <InputGroupButton size="icon-xs" aria-label="Dictate">
              <IconPlaceholder
                phosphor="MicrophoneIcon"
                lucide="MicIcon"
                tabler="IconMicrophone"
                hugeicons="Mic01Icon"
                remixicon="RiMicLine"
              />
            </InputGroupButton>
            <InputGroupText className="ms-auto">0 / 2000</InputGroupText>
            <InputGroupButton
              variant="default"
              size="icon-xs"
              className="rounded-full"
              aria-label="Send"
            >
              <IconPlaceholder
                phosphor="ArrowUpIcon"
                lucide="ArrowUpIcon"
                tabler="IconArrowUp"
                hugeicons="ArrowUp02Icon"
                remixicon="RiArrowUpLine"
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </CardContent>
    </Card>
  )
}
