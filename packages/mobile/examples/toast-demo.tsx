import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Toaster, toast } from "@/components/ui/toast"

export default function ToastDemo() {
  return (
    <Toaster>
      <View className="items-start gap-3">
        <Button
          variant="outline"
          onPress={() =>
            toast.add({
              title: "Event created",
              description: "Sunday, December 3 at 9:00 AM",
            })
          }
        >
          <Text>Show toast</Text>
        </Button>
        <Button
          variant="outline"
          onPress={() =>
            toast.add({
              title: "Message archived",
              type: "info",
              actionProps: {
                children: "Undo",
                onPress: () =>
                  toast.add({ title: "Restored", type: "success" }),
              },
            })
          }
        >
          <Text>With action</Text>
        </Button>
        <Button
          variant="outline"
          onPress={() =>
            toast.add({
              title: "Storage almost full",
              description: "Free up space to keep syncing.",
              type: "warning",
            })
          }
        >
          <Text>Warning</Text>
        </Button>
        <Button
          variant="outline"
          onPress={() =>
            toast.add({
              title: "Upload failed",
              description: "Check your connection and try again.",
              type: "error",
              priority: "high",
            })
          }
        >
          <Text>Error</Text>
        </Button>
        <Button
          variant="outline"
          onPress={() => {
            toast
              .promise(
                new Promise<void>((resolve) => setTimeout(resolve, 2000)),
                {
                  loading: "Saving changes",
                  success: "Changes saved",
                  error: "Could not save changes",
                }
              )
              .catch(() => undefined)
          }}
        >
          <Text>Promise</Text>
        </Button>
      </View>
    </Toaster>
  )
}
