import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"

export default function AvatarGroupExample() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/128?img=47" alt="Emma Wilson" />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/128?img=12" alt="Liam Carter" />
        <AvatarFallback>LC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://i.pravatar.cc/128?img=32"
          alt="Sofia Martinez"
        />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  )
}
