import PhosphorSwift
import SwiftUI

public struct LogLive: View {
  struct Event {
    let actor: String
    let action: String
    let detail: String
    var tint: Color?
    var icon: Image?
    var warning = false
  }

  struct Entry: Identifiable {
    let id: Int
    let time: Date
    let event: Event
  }

  static var feed: [Event] {
    [
      Event(actor: "Jamie Rivera", action: "signed in", detail: "Book Pro · San Francisco", tint: Palette.indigo500),
      Event(actor: "System", action: "finished a backup", detail: "12.4 GB · 3 min", icon: Ph.cloud.bold),
      Event(actor: "Morgan Lee", action: "updated a product", detail: "Phone Air · 240 in stock", tint: Palette.orange500, icon: Ph.tag.bold),
      Event(actor: "Riley Chen", action: "answered a ticket", detail: "#4821 Screen flickers", tint: Palette.green500, icon: Ph.chatCircle.bold),
      Event(actor: "System", action: "raised a warning", detail: "API latency 820 ms", icon: Ph.warning.bold, warning: true),
      Event(actor: "Jordan Park", action: "approved an order", detail: "W1052 · $399", tint: Palette.teal400, icon: Ph.handbag.bold),
    ]
  }

  static let limit = 7

  static func entry(_ id: Int, time: Date) -> Entry {
    Entry(id: id, time: time, event: feed[id % feed.count])
  }

  static func pushed(_ entries: [Entry], id: Int, time: Date) -> [Entry] {
    Array(([entry(id, time: time)] + entries).prefix(limit))
  }

  private var onNavigate: ((String) -> Void)?
  private var onRunningChange: ((Bool) -> Void)?
  private let ticking: Bool
  @State private var entries: [Entry]
  @State private var running: Bool
  @State private var count: Int
  @State private var pulse = false
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onRunningChange: ((_ running: Bool) -> Void)? = nil,
    onNavigate: ((_ section: String) -> Void)? = nil
  ) {
    self.init(count: 0, running: true)
    self.onRunningChange = onRunningChange
    self.onNavigate = onNavigate
  }

  init(count: Int, running: Bool, now: Date = .now, ticking: Bool = true) {
    var entries: [Entry] = []
    for id in 0..<count {
      entries = Self.pushed(entries, id: id, time: now.addingTimeInterval(Double(id - count + 1) * 60))
    }
    _entries = State(initialValue: entries)
    _running = State(initialValue: running)
    _count = State(initialValue: count)
    self.ticking = ticking
  }

  public var body: some View {
    LogLiveShell(home: "log", onNavigate: onNavigate) {
      page
    }
  }

  @ViewBuilder private var page: some View {
    Screen {
      HeaderScrollView {
        HeaderLargeTitle("Live activity", subtitle: running ? "Events appear as they happen" : "Paused")
        VStack(alignment: .leading, spacing: 20) {
          stats
          VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 8) {
              Text("Recent events")
                .scaledFont(.sm, weight: .semibold)
                .frame(maxWidth: .infinity, alignment: .leading)
                .accessibilityAddTraits(.isHeader)
              if running {
                HStack(spacing: 6) {
                  Circle()
                    .fill(Palette.green500)
                    .frame(width: 7, height: 7)
                    .opacity(pulse ? 0.35 : 1)
                  Text("Live")
                    .scaledFont(.xs)
                    .foregroundStyle(EsuissColor.mutedForeground)
                }
                .transition(.opacity)
                .onAppear {
                  guard !reduceMotion else { return }
                  withAnimation(.easeInOut(duration: 1).repeatForever(autoreverses: true)) { pulse = true }
                }
                .onDisappear { pulse = false }
              }
            }
            .padding(.horizontal, 4)
            VStack(spacing: 0) {
              ForEach(Array(entries.enumerated()), id: \.element.id) { index, entry in
                LogLiveRow(entry: entry)
                  .overlay(alignment: .top) {
                    if index > 0 {
                      EsuissColor.border.frame(height: 1).padding(.leading, 56)
                    }
                  }
                  .transition(.asymmetric(insertion: .opacity.combined(with: .offset(y: -10)), removal: .opacity))
              }
            }
            .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
            .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
          }
        }
        .padding(.horizontal, 16)
        .padding(.top, 8)
        .padding(.bottom, 24)
      } header: {
        Header {
          HeaderTitle("Live activity")
        } trailing: {
          Button {
            onRunningChange?(!running)
            running.toggle()
          } label: {
            SwiftUI.Label {
              Text(running ? "Pause" : "Resume")
            } icon: {
              (running ? Ph.pause.fill : Ph.play.fill).frame(width: 12, height: 12)
            }
          }
          .buttonStyle(.variant(.secondary, size: .sm))
        }
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.6), value: running)
    .task(id: running) {
      guard running, ticking else { return }
      if count == 0 { push() }
      while !Task.isCancelled {
        try? await Task.sleep(for: .milliseconds(2200))
        guard !Task.isCancelled else { break }
        push()
      }
    }
  }

  private var stats: some View {
    let items: [(LocalizedStringKey, Text)] = [
      ("This session", Text(count == 1 ? "\(count) event" : "\(count) events")),
      ("Active users", Text(verbatim: "14")),
      ("Avg. response", Text(verbatim: "182 ms")),
    ]
    return HStack(spacing: 0) {
      ForEach(Array(items.enumerated()), id: \.offset) { index, item in
        VStack(alignment: .leading, spacing: 2) {
          Text(item.0)
            .scaledFont(.xs)
            .foregroundStyle(EsuissColor.mutedForeground)
          item.1
            .scaledFont(.xl, weight: .semibold)
            .monospacedDigit()
            .contentTransition(.numericText())
        }
        .lineLimit(1)
        .minimumScaleFactor(0.7)
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .overlay(alignment: .leading) {
          if index > 0 {
            EsuissColor.border.frame(width: 1)
          }
        }
        .accessibilityElement(children: .combine)
      }
    }
    .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
  }

  private func push() {
    let id = count
    withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.7)) {
      entries = Self.pushed(entries, id: id, time: .now)
      count += 1
    }
  }
}

private struct LogLiveRow: View {
  let entry: LogLive.Entry

  var body: some View {
    let event = entry.event
    HStack(spacing: 12) {
      Group {
        if let tint = event.tint {
          Text(verbatim: event.actor.split(separator: " ").compactMap(\.first).map(String.init).joined())
            .scaledFont(.xs, weight: .semibold)
            .lineLimit(1)
            .minimumScaleFactor(0.5)
            .foregroundStyle(EsuissColor.primaryForeground)
            .frame(width: 28, height: 28)
            .background(tint, in: Circle())
        } else {
          (event.icon ?? Ph.gear.bold)
            .frame(width: 16, height: 16)
            .foregroundStyle(EsuissColor.primaryForeground)
            .frame(width: 28, height: 28)
            .background(event.warning ? Palette.orange500 : Palette.zinc500, in: RoundedRectangle(cornerRadius: 7, style: .continuous))
        }
      }
      .accessibilityHidden(true)
      VStack(alignment: .leading, spacing: 1) {
        Text("\(Text(verbatim: event.actor).fontWeight(.semibold)) \(Text(LocalizedStringKey(event.action)))")
          .scaledFont(.sm)
          .lineLimit(1)
        Text(verbatim: event.detail)
          .scaledFont(.xs)
          .foregroundStyle(EsuissColor.mutedForeground)
          .lineLimit(1)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      Text(entry.time, format: .dateTime.hour().minute())
        .scaledFont(.sm)
        .monospacedDigit()
        .foregroundStyle(EsuissColor.mutedForeground)
    }
    .foregroundStyle(EsuissColor.foreground)
    .padding(.horizontal, 16)
    .padding(.vertical, 8)
    .frame(minHeight: 44)
    .accessibilityElement(children: .combine)
  }
}

private struct LogLiveShell<Content: View>: View {
  let home: String
  let onNavigate: ((String) -> Void)?
  let content: Content

  @State private var tab: String

  init(home: String, onNavigate: ((String) -> Void)?, @ViewBuilder content: () -> Content) {
    self.home = home
    self.onNavigate = onNavigate
    self.content = content()
    _tab = State(initialValue: home)
  }

  private static var sections: [(value: String, label: LocalizedStringKey, icon: Image, active: Image)] {
    [
      ("users", "Users", Ph.users.regular, Ph.users.fill),
      ("roles", "Roles", Ph.shield.regular, Ph.shield.fill),
      ("log", "Activity", Ph.chartBar.regular, Ph.chartBar.fill),
      ("settings", "Settings", Ph.gear.regular, Ph.gear.fill),
    ]
  }

  var body: some View {
    let selection = Binding<String>(
      get: { tab },
      set: { value in
        guard value != tab else { return }
        onNavigate?(value)
        tab = value
      }
    )
    Screen {
      ZStack {
        content
          .opacity(tab == home ? 1 : 0)
          .allowsHitTesting(tab == home)
          .accessibilityHidden(tab != home)
        if tab != home {
          Empty {
            EmptyHeader {
              EmptyDescription("This section isn't part of the sample. Choose \(Text(Self.sections.first { $0.value == home }?.label ?? "")).")
            }
          }
          .background(EsuissColor.background)
        }
      }
      .frame(maxHeight: .infinity)
      TabBar(selection: selection) {
        ForEach(Self.sections, id: \.value) { section in
          TabBarItem(section.label, value: section.value, icon: section.icon, activeIcon: section.active)
        }
      }
    }
  }
}
