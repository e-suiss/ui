import ActivityKit
import EsuissUI
import PhosphorSwift
import SwiftUI
import WidgetKit

@main
struct CatalogWidgets: WidgetBundle {
  var body: some SwiftUI.Widget {
    DownloadActivityWidget()
  }
}

struct DownloadActivityWidget: SwiftUI.Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: DownloadActivityAttributes.self) { context in
      DownloadLockScreen(state: context.state)
        .activityBackgroundTint(Palette.black)
        .activitySystemActionForegroundColor(Palette.white)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          DownloadFileTile()
        }
        DynamicIslandExpandedRegion(.trailing) {
          Text(verbatim: "\(context.state.percent)%")
            .textStyle(.xl2, weight: .semibold)
            .monospacedDigit()
            .foregroundStyle(Palette.white)
            .frame(height: 40)
        }
        DynamicIslandExpandedRegion(.center) {
          DownloadTitle(state: context.state)
        }
        DynamicIslandExpandedRegion(.bottom) {
          DownloadProgressBar(progress: context.state.progress)
            .padding(.top, 8)
        }
      } compactLeading: {
        ActivityIcon(image: Ph.downloadSimple.bold, size: 16)
          .foregroundStyle(EsuissColor.primary)
      } compactTrailing: {
        DownloadStatus(state: context.state)
      } minimal: {
        DownloadStatus(state: context.state)
      }
      .keylineTint(EsuissColor.primary)
    }
  }
}

struct ActivityIcon: View {
  let image: Image
  let size: CGFloat

  @Environment(\.displayScale) private var scale

  var body: some View {
    let renderer = ImageRenderer(content: image.frame(width: size, height: size))
    renderer.scale = scale
    return Group {
      if let rendered = renderer.uiImage {
        Image(uiImage: rendered)
          .renderingMode(.template)
          .resizable()
      }
    }
    .frame(width: size, height: size)
  }
}

struct DownloadStatus: View {
  let state: DownloadActivityAttributes.ContentState

  var body: some View {
    if state.finished {
      ActivityIcon(image: Ph.checkCircle.fill, size: 16)
        .foregroundStyle(Color.adaptive(light: Palette.green600, dark: Palette.green400))
    } else {
      IslandRing(value: state.progress)
    }
  }
}

struct DownloadFileTile: View {
  var body: some View {
    ActivityIcon(image: Ph.fileZip.fill, size: 24)
      .foregroundStyle(EsuissColor.primary)
      .frame(width: 40, height: 40)
      .background(Palette.white.opacity(0.15), in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
      .accessibilityHidden(true)
  }
}

struct DownloadTitle: View {
  let state: DownloadActivityAttributes.ContentState
  var alignment: HorizontalAlignment = .center

  var body: some View {
    VStack(alignment: alignment, spacing: 0) {
      Text(state.finished ? "Downloaded" : "Downloading")
        .textStyle(.sm, weight: .semibold)
        .foregroundStyle(Palette.white)
      Text(verbatim: state.fileName)
        .textStyle(.sm)
        .foregroundStyle(Palette.white.opacity(0.6))
    }
    .lineLimit(1)
  }
}

struct DownloadProgressBar: View {
  let progress: Double

  var body: some View {
    Capsule()
      .fill(Palette.white.opacity(0.2))
      .frame(height: 6)
      .overlay(alignment: .leading) {
        GeometryReader { proxy in
          Capsule()
            .fill(EsuissColor.primary)
            .frame(width: proxy.size.width * min(max(progress, 0), 1))
        }
      }
      .clipShape(Capsule())
      .accessibilityElement()
      .accessibilityLabel(Text("Download progress"))
      .accessibilityValue(Text(verbatim: "\(Int((min(max(progress, 0), 1) * 100).rounded()))%"))
  }
}

struct DownloadLockScreen: View {
  let state: DownloadActivityAttributes.ContentState

  var body: some View {
    VStack(spacing: 12) {
      HStack(spacing: 12) {
        DownloadFileTile()
        DownloadTitle(state: state, alignment: .leading)
          .frame(maxWidth: .infinity, alignment: .leading)
        Text(verbatim: "\(state.percent)%")
          .textStyle(.xl2, weight: .semibold)
          .monospacedDigit()
          .foregroundStyle(Palette.white)
      }
      DownloadProgressBar(progress: state.progress)
    }
    .padding(16)
  }
}
