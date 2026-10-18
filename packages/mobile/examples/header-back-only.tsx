import { View } from "react-native"
import { Header, HeaderBack, HeaderTitle } from "@/components/ui/header"

export default function HeaderBackOnly() {
  return (
    <View className="-mx-4 -mt-4">
      <Header>
        <HeaderBack>A very long previous screen title</HeaderBack>
        <HeaderTitle>Details</HeaderTitle>
      </Header>
    </View>
  )
}
