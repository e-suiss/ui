import type { StorybookConfig } from "@storybook/react-native"

const main: StorybookConfig = {
  stories: ["../stories/**/*.stories.tsx"],
  deviceAddons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
  ],
}

export default main
