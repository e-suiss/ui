import EsuissUI
import SwiftUI

enum RadialChartsStories {
  static let group = StoryGroup(.charts, "Radial", stories: [
    Story("Batteries") {
      RadialChartBatteries()
    },
    Story("Default") {
      RadialChartDefault()
    },
    Story("Gauge") {
      RadialChartGauge()
    },
    Story("Interactive") {
      RadialChartInteractive()
    },
    Story("Label") {
      RadialChartLabel()
    },
    Story("Progress") {
      RadialChartProgress()
    },
    Story("Rings") {
      RadialChartRings()
    },
    Story("Stacked") {
      RadialChartStacked()
    },
    Story("Text") {
      RadialChartText()
    },
    Story("Tinted") {
      RadialChartTinted()
    },
  ])
}
