import { CalendarBlankIcon } from "phosphor-react-native"
import { View } from "react-native"
import {
  Preview,
  PreviewContent,
  PreviewTrigger,
} from "@/components/patterns/preview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function PreviewWithCloseButton() {
  return (
    <View className="flex-1 items-center justify-center">
      <Preview defaultOpen>
        <PreviewTrigger>@ada</PreviewTrigger>
        <PreviewContent showCloseButton accessibilityLabel="@ada">
          <View className="flex-row gap-4">
            <Avatar size="lg">
              <AvatarImage
                alt="Ada Lovelace"
                source={{ uri: "https://i.pravatar.cc/150?img=5" }}
              />
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <View className="flex-1 gap-1">
              <Text className="text-sm font-semibold">@ada</Text>
              <Text className="text-sm">
                Mathematician and writer, known for her work on the Analytical
                Engine.
              </Text>
              <View className="mt-1 flex-row items-center gap-1.5">
                <Icon
                  as={CalendarBlankIcon}
                  className="size-4 text-muted-foreground"
                />
                <Text className="text-xs text-muted-foreground">
                  Joined December 2021
                </Text>
              </View>
            </View>
          </View>
        </PreviewContent>
      </Preview>
    </View>
  )
}
