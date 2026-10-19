import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
} from "@/components/ui/message"

export function ChatThread() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Maya Lindqvist</CardTitle>
        <CardDescription>Active now</CardDescription>
        <CardAction>
          <Badge variant="secondary">Trip planning</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <MessageGroup className="gap-4">
          <Message>
            <MessageAvatar>
              <Avatar>
                <AvatarFallback>ML</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <Bubble variant="muted">
                <BubbleContent>
                  Is the cabin still free on the 14th?
                </BubbleContent>
              </Bubble>
              <Bubble variant="muted">
                <BubbleContent>We could drive up Friday evening.</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message align="end">
            <MessageContent>
              <Bubble>
                <BubbleContent>Yes, I just booked two nights.</BubbleContent>
              </Bubble>
              <Bubble>
                <BubbleContent>I'll bring the board games.</BubbleContent>
              </Bubble>
              <MessageFooter>Read 9:41 AM</MessageFooter>
            </MessageContent>
          </Message>
          <Message>
            <MessageAvatar>
              <Avatar>
                <AvatarFallback>ML</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <Bubble variant="muted">
                <BubbleContent>Perfect, see you then!</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </MessageGroup>
      </CardContent>
      <CardFooter>
        <InputGroup>
          <InputGroupInput placeholder="Message" aria-label="Message" />
          <InputGroupAddon align="inline-end">
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
      </CardFooter>
    </Card>
  )
}
