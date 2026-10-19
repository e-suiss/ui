import { View } from "react-native"
import { captureScreen } from "react-native-view-shot"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Text } from "@/components/ui/text"
import { ThemeProvider, ThemeToggle } from "@/components/ui/theme"

export default function ThemeCircleFromCorner() {
  return (
    <ThemeProvider
      defaultTheme="light"
      storageKey="theme-story"
      snapshot={() => captureScreen().then((uri) => ({ uri }))}
    >
      <View className="w-full gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Light and dark.</CardTitle>
            <CardDescription>
              The old theme stays on top and the new one grows out of the shape.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Text className="text-sm text-muted-foreground">
              Pick a theme below to watch the transition.
            </Text>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button block>
              <Text>Continue</Text>
            </Button>
            <Button block variant="secondary">
              <Text>Not now</Text>
            </Button>
          </CardFooter>
        </Card>
        <ThemeToggle effect="circle" origin="top-right" />
      </View>
    </ThemeProvider>
  )
}
