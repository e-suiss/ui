import PhosphorSwift
import SwiftUI

public struct RolesRequests: View {
  enum Decision {
    case approved, denied
  }

  struct Request: Identifiable, Equatable {
    let name: String
    let permission: String
    let reason: String
    let time: String
    let tint: Color
    var decision: Decision?

    var id: String { name }
  }

  static var initialRequests: [Request] {
    [
      Request(name: "Morgan Lee", permission: "Change prices", reason: "I need to update the campaign prices.", time: "10 min ago", tint: .orange),
      Request(name: "Riley Chen", permission: "Export customers", reason: "I need the customer list for the monthly report.", time: "1 hr ago", tint: .green),
      Request(name: "Jordan Park", permission: "Issue refunds", reason: "So I can refund support tickets myself.", time: "Yesterday", tint: .mint),
      Request(name: "Taylor Kim", permission: "Publish", reason: "I'd like to publish blog posts.", time: "2 days ago", tint: .blue),
    ]
  }

  static let durations = ["24 hours", "7 days", "Permanent"]

  private var onNavigate: ((String) -> Void)?
  private var onApprove: ((String, String) -> Void)?
  private var onDeny: ((String) -> Void)?
  private var onDurationChange: ((String) -> Void)?
  private let swiped: String?
  @State private var requests: [Request]
  @State private var duration: String?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onApprove: ((_ request: String, _ duration: String) -> Void)? = nil,
    onDeny: ((_ request: String) -> Void)? = nil,
    onDurationChange: ((_ duration: String) -> Void)? = nil,
    onNavigate: ((_ section: String) -> Void)? = nil
  ) {
    self.init(requests: Self.initialRequests)
    self.onNavigate = onNavigate
    self.onApprove = onApprove
    self.onDeny = onDeny
    self.onDurationChange = onDurationChange
  }

  init(requests: [Request], swiped: String? = nil) {
    _requests = State(initialValue: requests)
    _duration = State(initialValue: "Permanent")
    self.swiped = swiped
  }

  private var animation: Animation? {
    reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.4)
  }

  public var body: some View {
    RolesRequestsShell(home: "roles", onNavigate: onNavigate) {
      page
    }
  }

  @ViewBuilder private var page: some View {
    let open = requests.filter { $0.decision == nil }.count
    let durationSelection = Binding<String?>(
      get: { duration },
      set: { value in
        guard let value, value != duration else { return }
        onDurationChange?(value)
        duration = value
      }
    )
    Screen {
      HeaderScrollView {
        HeaderLargeTitle("Access requests", subtitle: open == 1 ? "1 pending request" : "\(open) pending requests")
        VStack(alignment: .leading, spacing: 20) {
          ItemGroup(.inset) {
            Item(size: .sm) {
              ItemContent {
                ItemTitle { Text("Approval length").fontWeight(.regular) }
              }
              ItemActions {
                OptionPicker(selection: durationSelection, size: .sm) {
                  ForEach(Self.durations, id: \.self) { item in
                    OptionPickerItem(LocalizedStringKey(item), value: item)
                  }
                }
                .fixedSize()
                .accessibilityLabel(Text("Approval length"))
              }
            }
          }
          if requests.isEmpty {
            Empty {
              EmptyHeader {
                EmptyMedia {
                  Ph.check.bold
                    .frame(width: 40, height: 40)
                    .foregroundStyle(Color.green)
                }
                EmptyTitle("No pending requests.")
              }
              EmptyContent {
                Button("Reset the sample ›") {
                  withAnimation(animation) { requests = Self.initialRequests }
                }
                .buttonStyle(.variant(.link, size: .sm))
              }
            }
            .padding(.top, 24)
            .transition(.opacity.combined(with: .offset(y: 8)))
          } else {
            VStack(spacing: 0) {
              ForEach(Array(requests.enumerated()), id: \.element.id) { index, request in
                SwipeActions(background: .surfaceSecondary, revealed: swiped == request.name ? 88 : 0) {
                  RolesRequestsRow(
                    request: request,
                    separator: index > 0,
                    onDeny: { decide(request.name, .denied) },
                    onApprove: { decide(request.name, .approved) }
                  )
                } leading: {
                  if request.decision == nil {
                    SwipeAction("Approve", icon: Ph.check.bold, variant: .default, fullSwipe: true) {
                      decide(request.name, .approved)
                    }
                  }
                } trailing: {
                  if request.decision == nil {
                    SwipeAction("Deny", icon: Ph.x.bold, variant: .destructive, fullSwipe: true) {
                      decide(request.name, .denied)
                    }
                  }
                }
                .transition(.opacity.combined(with: .scale(scale: 1, anchor: .top)))
              }
            }
            .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
            .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
          }
        }
        .padding(.horizontal, 16)
        .padding(.top, 8)
        .padding(.bottom, 24)
      } header: {
        Header {
          HeaderTitle("Access requests")
        }
      }
    }
  }

  private func decide(_ name: String, _ decision: Decision) {
    guard let index = requests.firstIndex(where: { $0.name == name }), requests[index].decision == nil else { return }
    if decision == .approved {
      onApprove?(name, duration ?? "Permanent")
    } else {
      onDeny?(name)
    }
    withAnimation(.easeOut(duration: 0.2)) { requests[index].decision = decision }
    Task {
      try? await Task.sleep(for: .milliseconds(900))
      withAnimation(animation) { requests.removeAll { $0.name == name } }
    }
  }
}

private struct RolesRequestsRow: View {
  let request: RolesRequests.Request
  let separator: Bool
  let onDeny: () -> Void
  let onApprove: () -> Void

  var body: some View {
    HStack(alignment: .top, spacing: 12) {
      Text(verbatim: request.name.split(separator: " ").compactMap(\.first).map(String.init).joined())
        .font(.system(size: 13, weight: .semibold))
        .foregroundStyle(Color.onAccent)
        .frame(width: 34, height: 34)
        .background(request.tint, in: Circle())
        .padding(.top, 12)
        .accessibilityHidden(true)
      VStack(alignment: .leading, spacing: 10) {
        VStack(alignment: .leading, spacing: 3) {
          HStack(spacing: 8) {
            Text(verbatim: request.name)
              .scaledFont(.sm, weight: .semibold)
            Text(LocalizedStringKey(request.time))
              .scaledFont(.xs)
              .foregroundStyle(Color.labelSecondary)
          }
          Text("Requests \(request.permission)")
            .scaledFont(.sm)
          Text(verbatim: request.reason)
            .scaledFont(.sm)
            .foregroundStyle(Color.labelSecondary)
            .fixedSize(horizontal: false, vertical: true)
        }
        .accessibilityElement(children: .combine)
        if let decision = request.decision {
          Text(decision == .approved ? "Approved" : "Denied")
            .scaledFont(.sm, weight: .semibold)
            .foregroundStyle(decision == .approved ? Color.success : .danger)
            .transition(.opacity)
        } else {
          HStack(spacing: 8) {
            Button("Deny", action: onDeny)
              .buttonStyle(.variant(.secondary, size: .sm))
            Button("Approve", action: onApprove)
              .buttonStyle(.variant(.default, size: .sm))
          }
        }
      }
      .padding(.vertical, 12)
      .padding(.trailing, 16)
      .frame(maxWidth: .infinity, alignment: .leading)
      .overlay(alignment: .top) {
        if separator {
          Color.separator.frame(height: 1)
        }
      }
    }
    .foregroundStyle(Color.label)
    .padding(.leading, 16)
  }
}

private struct RolesRequestsShell<Content: View>: View {
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
          .background(Color.surface)
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
