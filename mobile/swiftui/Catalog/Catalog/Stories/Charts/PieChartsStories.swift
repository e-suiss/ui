import EsuissUI
import SwiftUI

enum PieChartsStories {
  static let group = StoryGroup(.charts, "Pie", stories: [
    Story("Active") {
      PieChartActive()
    },
    Story("Default") {
      PieChartDefault()
    },
    Story("DonutText") {
      PieChartDonutText()
    },
    Story("Donut") {
      PieChartDonut()
    },
    Story("Half") {
      PieChartHalf()
    },
    Story("Interactive") {
      PieChartInteractive()
    },
    Story("Label") {
      PieChartLabel()
    },
    Story("Legend") {
      PieChartLegend()
    },
    Story("Nested") {
      PieChartNested()
    },
    Story("Separated") {
      PieChartSeparated()
    },
  ])
}
