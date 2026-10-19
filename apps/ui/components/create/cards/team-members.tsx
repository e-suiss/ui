import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TeamMembers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>
          Invite your team and set their access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-1">
          <Item size="sm" className="px-0">
            <ItemMedia>
              <Avatar>
                <AvatarFallback>MR</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent className="min-w-0">
              <ItemTitle>Maya Reyes</ItemTitle>
              <ItemDescription className="truncate">
                maya@harbor.team
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Select defaultValue="Owner">
                <SelectTrigger size="sm" aria-label="Role" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </ItemActions>
          </Item>
          <Item size="sm" className="px-0">
            <ItemMedia>
              <Avatar>
                <AvatarFallback>JO</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent className="min-w-0">
              <ItemTitle>Jonas Olsen</ItemTitle>
              <ItemDescription className="truncate">
                jonas@harbor.team
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Select defaultValue="Admin">
                <SelectTrigger size="sm" aria-label="Role" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </ItemActions>
          </Item>
          <Item size="sm" className="px-0">
            <ItemMedia>
              <Avatar>
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent className="min-w-0">
              <ItemTitle>Aiko Kato</ItemTitle>
              <ItemDescription className="truncate">
                aiko@harbor.team
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Select defaultValue="Editor">
                <SelectTrigger size="sm" aria-label="Role" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </ItemActions>
          </Item>
          <Item size="sm" className="px-0">
            <ItemMedia>
              <Avatar>
                <AvatarFallback>DB</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent className="min-w-0">
              <ItemTitle>Daniel Brooks</ItemTitle>
              <ItemDescription className="truncate">
                daniel@harbor.team
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Select defaultValue="Viewer">
                <SelectTrigger size="sm" aria-label="Role" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
