import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AvatarSizes() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarImage src="https://i.pravatar.cc/128?img=12" alt="Liam Carter" />
        <AvatarFallback>LC</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage src="https://i.pravatar.cc/128?img=12" alt="Liam Carter" />
        <AvatarFallback>LC</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://i.pravatar.cc/128?img=12" alt="Liam Carter" />
        <AvatarFallback>LC</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarImage src="https://i.pravatar.cc/128?img=12" alt="Liam Carter" />
        <AvatarFallback>LC</AvatarFallback>
      </Avatar>
    </div>
  )
}
