import { View } from "react-native"
import { ChatConversations } from "@/components/blocks/chat-conversations"

export default function ChatConversationsDemo() {
  return (
    <View className="-m-4 flex-1">
      <ChatConversations />
    </View>
  )
}
