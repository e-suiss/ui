import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/128?img=47" alt="Emma Wilson" />
      <AvatarFallback>EW</AvatarFallback>
    </Avatar>
  )
}
