import PhosphorSwift
import SwiftUI

public struct SettingsNotifications: View {
  enum Alert: String, CaseIterable, Sendable {
    case lock, center, banner

    var label: LocalizedStringKey {
      switch self {
      case .lock: "Lock Screen"
      case .center: "Notification Center"
      case .banner: "Banners"
      }
    }

    var bars: [CGFloat] {
      switch self {
      case .lock: [58, 74]
      case .center: [12, 29, 46, 63]
      case .banner: [8]
      }
    }
  }

  static let wallpaper = URL(string: "https://images.unsplash.com/photo-1707324148764-99647364afa3?w=600&q=80&auto=format&fit=crop")
  static var previewOptions: [String] { ["Always", "When Unlocked", "Never"] }
  static var groupingOptions: [String] { ["Automatic", "By App", "Off"] }

  @State private var allow: Bool
  @State private var enabled: Set<Alert> = Set(Alert.allCases)
  @State private var bannerStyle: String? = "temporary"
  @State private var sounds = true
  @State private var badges = true
  @State private var previews: String? = "Always"
  @State private var grouping: String? = "Automatic"
  @State private var bannerKey = 0
  @State private var bannerVisible = true
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init() {
    self.init(allow: true)
  }

  init(allow: Bool) {
    _allow = State(initialValue: allow)
  }

  private var footnote: LocalizedStringKey {
    if !allow { return "Notifications are off" }
    if !enabled.contains(.banner) { return "No banners" }
    return bannerStyle == "persistent" ? "Banner stays until dismissed" : "Banner shows briefly"
  }

  private var message: LocalizedStringKey {
    previews == "Never" ? "Notification" : "Is the weekend trip to the coast still on?"
  }

  public var body: some View {
    Screen {
      KeyboardScrollView {
        VStack(alignment: .leading, spacing: 20) {
          heading
          ItemGroup(.inset) {
            switchRow("Allow Notifications", isOn: Binding(
              get: { allow },
              set: { value in
                allow = value
                replay()
              }
            ))
          }
          VStack(alignment: .leading, spacing: 20) {
            sectionTitle("Alerts")
            ItemGroup(.inset) {
              HStack(spacing: 0) {
                ForEach(Alert.allCases, id: \.self) { alert in
                  SettingsNotificationsAlert(alert: alert, on: enabled.contains(alert)) {
                    if enabled.contains(alert) {
                      enabled.remove(alert)
                    } else {
                      enabled.insert(alert)
                    }
                    replay()
                  }
                }
              }
              .padding(.horizontal, 8)
              if enabled.contains(.banner) {
                ItemSeparator()
                Item(size: .sm) {
                  ItemContent {
                    ItemTitle { Text("Banner Style").fontWeight(.regular) }
                  }
                  ItemActions {
                    ToggleGroup(selection: Binding(
                      get: { bannerStyle },
                      set: { value in
                        guard let value else { return }
                        bannerStyle = value
                        replay()
                      }
                    ), size: .sm, spacing: 0) {
                      ToggleGroupItem("Temporary", value: "temporary")
                      ToggleGroupItem("Persistent", value: "persistent")
                    }
                    .accessibilityLabel(Text("Banner style"))
                  }
                }
              }
              ItemSeparator()
              switchRow("Sounds", isOn: $sounds)
              ItemSeparator()
              switchRow("Badges", isOn: $badges)
            }
            sectionTitle("Appearance")
            ItemGroup(.inset) {
              pickerRow("Show Previews", selection: Binding(
                get: { previews },
                set: { value in
                  previews = value
                  replay()
                }
              ), options: Self.previewOptions)
              ItemSeparator()
              pickerRow("Notification Grouping", selection: $grouping, options: Self.groupingOptions)
            }
          }
          .disabled(!allow)
          .opacity(allow ? 1 : 0.35)
          .animation(.easeInOut(duration: 0.3), value: allow)
          lockScreen
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
            .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous))
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 24)
      }
    }
    .task(id: [bannerStyle == "temporary", bannerVisible, bannerKey != 0]) {
      guard bannerStyle == "temporary", bannerVisible else { return }
      try? await Task.sleep(for: .milliseconds(2600))
      guard !Task.isCancelled else { return }
      withAnimation(reduceMotion ? nil : .easeOut(duration: 0.4)) { bannerVisible = false }
    }
  }

  private var heading: some View {
    HStack(spacing: 12) {
      Ph.chatCircle.fill
        .frame(width: 24, height: 24)
        .foregroundStyle(Color.onAccent)
        .frame(width: 40, height: 40)
        .background(Color.green, in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
        .accessibilityHidden(true)
      VStack(alignment: .leading, spacing: 0) {
        Text("Messages")
          .scaledFont(.xl2, weight: .bold)
          .accessibilityAddTraits(.isHeader)
        Text("Notifications")
          .scaledFont(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
    }
  }

  private func sectionTitle(_ title: LocalizedStringKey) -> some View {
    Text(title)
      .scaledFont(.sm, weight: .semibold)
      .padding(.horizontal, 4)
      .padding(.bottom, -12)
      .accessibilityAddTraits(.isHeader)
  }

  private func switchRow(_ title: LocalizedStringKey, isOn: Binding<Bool>) -> some View {
    Item(size: .sm) {
      ItemContent {
        ItemTitle { Text(title).fontWeight(.regular) }
      }
      ItemActions {
        Toggle(isOn: isOn) { Text(title) }
          .labelsHidden()
          .accessibilityLabel(Text(title))
          .toggleStyle(SwitchStyle())
      }
    }
  }

  private func pickerRow(_ title: LocalizedStringKey, selection: Binding<String?>, options: [String]) -> some View {
    Item(size: .sm) {
      ItemContent {
        ItemTitle { Text(title).fontWeight(.regular) }
      }
      ItemActions {
        OptionPicker(selection: selection, size: .sm) {
          ForEach(options, id: \.self) { option in
            OptionPickerItem(LocalizedStringKey(option), value: option)
          }
        }
        .fixedSize()
        .accessibilityLabel(Text(title))
      }
    }
  }

  private var lockScreen: some View {
    Color.media
      .overlay {
        AsyncImage(url: Self.wallpaper) { phase in
          if let image = phase.image {
            image.resizable().scaledToFill()
          }
        }
      }
      .overlay {
        LinearGradient(colors: [Color.media.opacity(0.15), Color.media.opacity(0.35)], startPoint: .top, endPoint: .bottom)
      }
      .overlay(alignment: .top) {
        ZStack(alignment: .top) {
          Capsule()
            .fill(Color.media)
            .frame(width: 74, height: 22)
            .padding(.top, 8)
          VStack(spacing: 0) {
            Text("Tuesday, October 6")
              .scaledFont(.xs2, weight: .semibold)
              .opacity(0.9)
            Text(verbatim: "9:41")
              .font(.system(size: 60, weight: .semibold))
              .tracking(-2)
          }
          .padding(.top, 50)
          if allow && enabled.contains(.lock) {
            SettingsNotificationsCard(message: message, stacked: grouping != "Off")
              .padding(.horizontal, 8)
              .padding(.top, 300)
          }
          if allow && enabled.contains(.banner) && bannerVisible {
            SettingsNotificationsCard(message: message, stacked: false)
              .id(bannerKey)
              .padding(.horizontal, 8)
              .padding(.top, 38)
              .transition(reduceMotion ? .opacity : .move(edge: .top).combined(with: .opacity))
          }
          Text(footnote)
            .scaledFont(.xs3)
            .opacity(0.85)
            .frame(maxHeight: .infinity, alignment: .bottom)
            .padding(.bottom, 14)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
      }
      .foregroundStyle(Color.onMedia)
      .frame(width: 214, height: 454)
      .clipShape(RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous))
      .padding(8)
      .background(Color.media, in: RoundedRectangle(cornerRadius: Radius.xl3 + 8, style: .continuous))
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(Text("Lock screen preview. \(Text(footnote))."))
  }

  private func replay() {
    bannerKey += 1
    withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.8)) { bannerVisible = true }
  }
}

private struct SettingsNotificationsAlert: View {
  let alert: SettingsNotifications.Alert
  let on: Bool
  let action: () -> Void

  var body: some View {
    Button(action: action) {
      VStack(spacing: 8) {
        SettingsNotificationsMini(alert: alert)
        Text(alert.label)
          .scaledFont(.sm)
          .foregroundStyle(Color.label)
          .lineLimit(1)
          .minimumScaleFactor(0.8)
        ZStack {
          Circle()
            .strokeBorder(on ? Color.clear : .separatorStrong, lineWidth: 1.5)
            .background(on ? Color.accent : .clear, in: Circle())
          Ph.check.bold
            .frame(width: 12, height: 12)
            .foregroundStyle(Color.onAccent)
            .scaleEffect(on ? 1 : 0)
        }
        .frame(width: 22, height: 22)
        .animation(.spring(response: 0.25, dampingFraction: 0.6), value: on)
      }
      .padding(.top, 14)
      .padding(.bottom, 12)
      .frame(maxWidth: .infinity)
      .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(Text(alert.label))
    .accessibilityAddTraits(on ? [.isButton, .isSelected] : .isButton)
  }
}

private struct SettingsNotificationsMini: View {
  let alert: SettingsNotifications.Alert

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
    ZStack(alignment: .top) {
      Color.indigo
      if alert == .lock {
        Text(verbatim: "9:41")
          .scaledFont(.sm, weight: .semibold)
          .foregroundStyle(Color.onMedia)
          .padding(.top, 14)
      }
      ForEach(Array(alert.bars.enumerated()), id: \.offset) { index, top in
        RoundedRectangle(cornerRadius: Radius.xs, style: .continuous)
          .fill(Color.onMedia)
          .frame(height: 13)
          .opacity(1 - Double(index) * 0.15)
          .shadow(Shadow(color: Color.media.opacity(0.15), radius: 1.5, y: 1))
          .padding(.horizontal, 8)
          .padding(.top, top)
      }
    }
    .frame(width: 64, height: 92)
    .clipShape(shape)
    .overlay { shape.strokeBorder(Color.label, lineWidth: 2) }
    .accessibilityHidden(true)
  }
}

private struct SettingsNotificationsCard: View {
  let message: LocalizedStringKey
  let stacked: Bool

  var body: some View {
    ZStack(alignment: .bottom) {
      if stacked {
        RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
          .fill(Color.onMedia.opacity(0.55))
          .frame(height: 20)
          .padding(.horizontal, 10)
          .offset(y: 6)
      }
      HStack(alignment: .top, spacing: 10) {
        Ph.chatCircle.fill
          .frame(width: 18, height: 18)
          .foregroundStyle(Color.onMedia)
          .frame(width: 30, height: 30)
          .background(Color.green, in: RoundedRectangle(cornerRadius: Radius.md, style: .continuous))
        VStack(alignment: .leading, spacing: 1) {
          HStack {
            Text(verbatim: "Riley Morgan")
              .scaledFont(.xs2, weight: .semibold)
              .frame(maxWidth: .infinity, alignment: .leading)
            Text("now")
              .scaledFont(.xs3)
              .foregroundStyle(Color.media.opacity(0.55))
          }
          Text(message)
            .scaledFont(.xs2)
            .fixedSize(horizontal: false, vertical: true)
        }
      }
      .foregroundStyle(Color.media.opacity(0.88))
      .padding(.horizontal, 12)
      .padding(.vertical, 10)
      .background(Color.onMedia.opacity(0.82), in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
    }
  }
}
