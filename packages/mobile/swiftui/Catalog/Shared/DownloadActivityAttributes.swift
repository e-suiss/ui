import ActivityKit
import Foundation

nonisolated struct DownloadActivityAttributes: ActivityAttributes {
  struct ContentState: Codable, Hashable {
    var progress: Double
    var fileName: String
    var finished: Bool

    var percent: Int { Int((min(max(progress, 0), 1) * 100).rounded()) }
  }
}
