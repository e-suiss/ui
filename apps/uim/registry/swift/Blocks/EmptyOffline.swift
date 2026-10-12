import PhosphorSwift
import SwiftUI

public struct EmptyOffline: View {
  enum Status: Sendable {
    case offline, loading, online
  }

  struct Album: Identifiable {
    let title: String
    let image: URL?

    var id: String { title }
  }

  static func photo(_ id: String) -> URL? {
    URL(string: "https://images.unsplash.com/photo-\(id)?w=400&q=80&auto=format&fit=crop")
  }

  static var albums: [Album] {
    [
      Album(title: "Orange Hour", image: photo("1633596683562-4a47eb4983c5")),
      Album(title: "Soft Shapes", image: photo("1645323927877-3de25b4f819c")),
      Album(title: "Low Light", image: photo("1760978631841-f3754859ca59")),
      Album(title: "Waves", image: photo("1707324148764-99647364afa3")),
    ]
  }

  @State private var state: Status
  private var connects = true
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init() {
    self.init(state: .offline)
  }

  init(state: Status, connects: Bool = true) {
    _state = State(initialValue: state)
    self.connects = connects
  }

  public var body: some View {
    Screen {
      if state == .online {
        online
          .transition(.opacity.combined(with: .offset(y: 8)))
      } else {
        offline
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.8), value: state == .online)
    .task(id: state) {
      guard state == .loading, connects else { return }
      try? await Task.sleep(for: .milliseconds(1400))
      guard !Task.isCancelled else { return }
      state = .online
    }
  }

  private var offline: some View {
    Empty {
      EmptyHeader {
        EmptyMedia {
          Ph.wifiSlash.light
            .frame(width: 52, height: 52)
            .foregroundStyle(Color.labelTertiary)
        }
        EmptyTitle("You're not connected to the internet.")
        EmptyDescription("Turn on Wi-Fi or cellular data. Songs you downloaded still play offline.")
      }
      EmptyContent {
        HStack(spacing: 14) {
          Button {
            state = .loading
          } label: {
            HStack(spacing: 6) {
              if state == .loading {
                Spinner()
              }
              Text(state == .loading ? "Connecting" : "Try Again")
            }
          }
          .buttonStyle(.variant(.default, size: .lg))
          .disabled(state == .loading)
          Button("Downloads") {}
            .buttonStyle(.variant(.outline, size: .lg))
        }
      }
    }
    .padding(-24)
  }

  private var online: some View {
    KeyboardScrollView {
      VStack(alignment: .leading, spacing: 16) {
        HStack(spacing: 8) {
          Text(verbatim: "suiss Music")
            .scaledTextStyle(.xl2, weight: .bold)
            .frame(maxWidth: .infinity, alignment: .leading)
            .accessibilityAddTraits(.isHeader)
          Button("Disconnect ›") { state = .offline }
            .buttonStyle(EmptyOfflineLinkStyle())
        }
        LazyVGrid(columns: [GridItem(.flexible(), spacing: 14), GridItem(.flexible(), spacing: 14)], spacing: 14) {
          ForEach(Self.albums) { album in
            VStack(alignment: .leading, spacing: 6) {
              Color.control
                .aspectRatio(1, contentMode: .fit)
                .overlay {
                  AsyncImage(url: album.image) { phase in
                    if let image = phase.image {
                      image.resizable().scaledToFill()
                    }
                  }
                }
                .clipShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
                .accessibilityHidden(true)
              Text(verbatim: album.title)
                .scaledFont(.sm, weight: .semibold)
            }
          }
        }
      }
      .padding(.horizontal, 20)
      .padding(.vertical, 30)
    }
  }
}

private struct EmptyOfflineLinkStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(.sm)
      .foregroundStyle(Color.link)
      .opacity(configuration.isPressed ? 0.5 : 1)
      .frame(minHeight: 44)
      .contentShape(Rectangle())
  }
}
