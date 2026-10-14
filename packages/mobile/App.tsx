import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { PortalHost } from "@/components/primitives/portal"

import StorybookUIRoot from "./.rnstorybook"

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StorybookUIRoot />
        <PortalHost />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
