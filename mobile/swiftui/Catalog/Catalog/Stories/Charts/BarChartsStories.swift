import EsuissUI
import SwiftUI

enum BarChartsStories {
  static let group = StoryGroup(.charts, "Bar", stories: [
    Story("Active") {
      BarChartActive()
    },
    Story("Default") {
      BarChartDefault()
    },
    Story("Horizontal") {
      BarChartHorizontal()
    },
    Story("Hourly") {
      BarChartHourly()
    },
    Story("Interactive") {
      BarChartInteractive()
    },
    Story("Labeled") {
      BarChartLabeled()
    },
    Story("Multiple") {
      BarChartMultiple()
    },
    Story("Negative") {
      BarChartNegative()
    },
    Story("Range") {
      BarChartRange()
    },
    Story("Stacked") {
      BarChartStacked()
    },
  ])
}
