import EsuissUI
import SwiftUI

enum AreaChartsStories {
  static let group = StoryGroup(.charts, "Area", stories: [
    Story("Default") {
      AreaChartDefault()
    },
    Story("Axes") {
      AreaChartAxes()
    },
    Story("Gradient") {
      AreaChartGradient()
    },
    Story("Interactive") {
      AreaChartInteractive()
    },
    Story("Linear") {
      AreaChartLinear()
    },
    Story("Range") {
      AreaChartRange()
    },
    Story("Sparkline") {
      AreaChartSparkline()
    },
    Story("StackedExpand") {
      AreaChartStackedExpand()
    },
    Story("Stacked") {
      AreaChartStacked()
    },
    Story("Step") {
      AreaChartStep()
    },
  ])
}
