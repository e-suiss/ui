import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AvatarFallbackSizes() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
    </div>
  )
}
