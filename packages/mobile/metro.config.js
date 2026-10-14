const { getDefaultConfig } = require("expo/metro-config")
const { withStorybook } = require("@storybook/react-native/metro/withStorybook")
const { withUniwindConfig } = require("uniwind/metro")

const config = getDefaultConfig(__dirname)

module.exports = withUniwindConfig(withStorybook(config), {
  cssEntryFile: "./.rnstorybook/global.css",
  dtsFile: "./uniwind-types.d.ts",
})
