import type { Preview } from "@storybook/react-native"
import { View } from "react-native"

const preview: Preview = {
  decorators: [
    (Story, { parameters }) => (
      <View
        className={
          parameters.layout === "fullscreen"
            ? "flex-1 bg-surface"
            : "flex-1 bg-surface p-4"
        }
      >
        <Story />
      </View>
    ),
  ],
}

export default preview
