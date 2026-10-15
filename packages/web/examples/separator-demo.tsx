import { Separator } from "@/components/ui/separator"

export default function SeparatorDemo() {
  return (
    <div className="w-72">
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-medium">Account settings</h4>
        <p className="text-muted-foreground text-sm">
          Manage your profile and preferences.
        </p>
      </div>
      <Separator orientation="horizontal" className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Profile</span>
        <Separator orientation="vertical" />
        <span>Billing</span>
        <Separator orientation="vertical" />
        <span>Security</span>
      </div>
    </div>
  )
}
