import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

export function Deployments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployments</CardTitle>
        <CardDescription>Recent builds for web-app.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item size="sm" className="px-0">
            <ItemContent className="min-w-0">
              <ItemTitle className="w-full">
                <span className="truncate">Add weekly summary email</span>
                <Badge className="ms-auto">Ready</Badge>
              </ItemTitle>
              <ItemDescription className="flex items-center gap-1.5">
                <IconPlaceholder
                  phosphor="GitBranchIcon"
                  lucide="GitBranchIcon"
                  tabler="IconGitBranch"
                  hugeicons="GitBranchIcon"
                  remixicon="RiGitBranchLine"
                  className="size-3.5"
                />
                <span className="font-mono">main</span>
                <span>·</span>
                <span className="font-mono">a41c9e2</span>
                <span>·</span>
                <span>4m ago</span>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon-sm" aria-label="More" />
                  }
                >
                  <IconPlaceholder
                    phosphor="DotsThreeIcon"
                    lucide="EllipsisIcon"
                    tabler="IconDots"
                    hugeicons="MoreHorizontalIcon"
                    remixicon="RiMoreLine"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem>
                    <IconPlaceholder
                      phosphor="ArrowUpRightIcon"
                      lucide="ArrowUpRightIcon"
                      tabler="IconArrowUpRight"
                      hugeicons="ArrowUpRight01Icon"
                      remixicon="RiArrowRightUpLine"
                    />
                    Visit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      phosphor="TerminalWindowIcon"
                      lucide="TerminalIcon"
                      tabler="IconTerminal2"
                      hugeicons="ComputerTerminal01Icon"
                      remixicon="RiTerminalBoxLine"
                    />
                    View logs
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      phosphor="ArrowClockwiseIcon"
                      lucide="RotateCwIcon"
                      tabler="IconRotateClockwise"
                      hugeicons="RotateClockwiseIcon"
                      remixicon="RiRestartLine"
                    />
                    Redeploy
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <IconPlaceholder
                      phosphor="XCircleIcon"
                      lucide="CircleXIcon"
                      tabler="IconCircleX"
                      hugeicons="CancelCircleIcon"
                      remixicon="RiCloseCircleLine"
                    />
                    Cancel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item size="sm" className="px-0">
            <ItemContent className="min-w-0">
              <ItemTitle className="w-full">
                <span className="truncate">Fix timezone in calendar</span>
                <Badge variant="secondary" className="ms-auto">
                  Building
                </Badge>
              </ItemTitle>
              <ItemDescription className="flex items-center gap-1.5">
                <IconPlaceholder
                  phosphor="GitBranchIcon"
                  lucide="GitBranchIcon"
                  tabler="IconGitBranch"
                  hugeicons="GitBranchIcon"
                  remixicon="RiGitBranchLine"
                  className="size-3.5"
                />
                <span className="font-mono">fix/tz</span>
                <span>·</span>
                <span className="font-mono">9be03f1</span>
                <span>·</span>
                <span>12m ago</span>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="ghost" size="icon-sm" aria-label="More">
                <IconPlaceholder
                  phosphor="DotsThreeIcon"
                  lucide="EllipsisIcon"
                  tabler="IconDots"
                  hugeicons="MoreHorizontalIcon"
                  remixicon="RiMoreLine"
                />
              </Button>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item size="sm" className="px-0">
            <ItemContent className="min-w-0">
              <ItemTitle className="w-full">
                <span className="truncate">Update onboarding copy</span>
                <Badge variant="destructive" className="ms-auto">
                  Failed
                </Badge>
              </ItemTitle>
              <ItemDescription className="flex items-center gap-1.5">
                <IconPlaceholder
                  phosphor="GitBranchIcon"
                  lucide="GitBranchIcon"
                  tabler="IconGitBranch"
                  hugeicons="GitBranchIcon"
                  remixicon="RiGitBranchLine"
                  className="size-3.5"
                />
                <span className="font-mono">copy/intro</span>
                <span>·</span>
                <span className="font-mono">27d8b10</span>
                <span>·</span>
                <span>1h ago</span>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="ghost" size="icon-sm" aria-label="More">
                <IconPlaceholder
                  phosphor="DotsThreeIcon"
                  lucide="EllipsisIcon"
                  tabler="IconDots"
                  hugeicons="MoreHorizontalIcon"
                  remixicon="RiMoreLine"
                />
              </Button>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item size="sm" className="px-0">
            <ItemContent className="min-w-0">
              <ItemTitle className="w-full">
                <span className="truncate">Bump image cache headers</span>
                <Badge variant="outline" className="ms-auto">
                  Canceled
                </Badge>
              </ItemTitle>
              <ItemDescription className="flex items-center gap-1.5">
                <IconPlaceholder
                  phosphor="GitBranchIcon"
                  lucide="GitBranchIcon"
                  tabler="IconGitBranch"
                  hugeicons="GitBranchIcon"
                  remixicon="RiGitBranchLine"
                  className="size-3.5"
                />
                <span className="font-mono">main</span>
                <span>·</span>
                <span className="font-mono">f03a7c4</span>
                <span>·</span>
                <span>3h ago</span>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="ghost" size="icon-sm" aria-label="More">
                <IconPlaceholder
                  phosphor="DotsThreeIcon"
                  lucide="EllipsisIcon"
                  tabler="IconDots"
                  hugeicons="MoreHorizontalIcon"
                  remixicon="RiMoreLine"
                />
              </Button>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
