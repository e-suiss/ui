import EsuissUI
import SwiftUI

enum LineChartsStories {
  static let group = StoryGroup(.charts, "Line", stories: [
    Story("Default") {
      LineChartDefault()
    },
    Story("Dots") {
      LineChartDots()
    },
    Story("Forecast") {
      LineChartForecast()
    },
    Story("GoalDots") {
      LineChartGoalDots()
    },
    Story("Goal") {
      LineChartGoal()
    },
    Story("Interactive") {
      LineChartInteractive()
    },
    Story("Labeled") {
      LineChartLabeled()
    },
    Story("Linear") {
      LineChartLinear()
    },
    Story("Multiple") {
      LineChartMultiple()
    },
    Story("Step") {
      LineChartStep()
    },
  ])
}
