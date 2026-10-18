import {
  ActionMenu,
  ActionMenuContent,
  ActionMenuItem,
  ActionMenuLabel,
  ActionMenuSeparator,
  ActionMenuTrigger,
} from "@/components/patterns/action-menu"
import { Button } from "@/components/ui/button"

export default function ActionMenuNotDismissible() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <ActionMenu dismissible={false}>
        <ActionMenuTrigger asChild>
          <Button variant="outline">Order actions</Button>
        </ActionMenuTrigger>
        <ActionMenuContent>
          <ActionMenuLabel>Order #1042</ActionMenuLabel>
          <ActionMenuItem>Edit</ActionMenuItem>
          <ActionMenuItem>Duplicate</ActionMenuItem>
          <ActionMenuItem>Share</ActionMenuItem>
          <ActionMenuSeparator />
          <ActionMenuItem variant="destructive">Delete</ActionMenuItem>
        </ActionMenuContent>
      </ActionMenu>
    </div>
  )
}
