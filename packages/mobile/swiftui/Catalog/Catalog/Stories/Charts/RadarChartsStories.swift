import EsuissUI
import SwiftUI

enum RadarChartsStories {
  static let group = StoryGroup(.charts, "Radar", stories: [
    Story("Default") {
      RadarChartDefault()
    },
    Story("Dots") {
      RadarChartDots()
    },
    Story("GridCircle") {
      RadarChartGridCircle()
    },
    Story("GridFilled") {
      RadarChartGridFilled()
    },
    Story("GridNone") {
      RadarChartGridNone()
    },
    Story("Interactive") {
      RadarChartInteractive()
    },
    Story("Legend") {
      RadarChartLegend()
    },
    Story("LinesOnly") {
      RadarChartLinesOnly()
    },
    Story("Multiple") {
      RadarChartMultiple()
    },
    Story("RadiusAxis") {
      RadarChartRadiusAxis()
    },
  ])
}
