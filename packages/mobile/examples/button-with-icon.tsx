import {
  ArrowRightIcon,
  DownloadSimpleIcon,
  TrashIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ButtonWithIcon() {
  return (
    <View className="items-start gap-3">
      <Button>
        <Icon as={DownloadSimpleIcon} />
        <Text>Download</Text>
      </Button>
      <Button variant="outline">
        <Text>Continue</Text>
        <Icon as={ArrowRightIcon} />
      </Button>
      <Button variant="destructive">
        <Icon as={TrashIcon} />
        <Text>Delete</Text>
      </Button>
    </View>
  )
}
