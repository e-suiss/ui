import PhosphorSwift
import SwiftUI

public struct SettingsDevice: View {
  struct Toggles: Equatable, Sendable {
    var airplane = false
    var wifi = true
    var bluetooth = true
    var focus = false
  }

  struct Row {
    let label: String
    let icon: Image
    let tint: Color
    var toggle: WritableKeyPath<Toggles, Bool>?
    var detail: ((Toggles) -> LocalizedStringKey?)?
  }

  static var groups: [[Row]] {
    [
      [
        Row(label: "Airplane Mode", icon: Ph.airplane.bold, tint: .orange, toggle: \.airplane),
        Row(label: "Wi-Fi", icon: Ph.wifiHigh.bold, tint: .blue, detail: { $0.wifi ? "Home" : "Off" }),
        Row(label: "Bluetooth", icon: Ph.bluetooth.bold, tint: .blue, detail: { $0.bluetooth ? "On" : "Off" }),
        Row(label: "Cellular", icon: Ph.cellSignalFull.bold, tint: .green, detail: { $0.airplane ? "Off" : nil }),
      ],
      [
        Row(label: "Notifications", icon: Ph.bell.bold, tint: .red),
        Row(label: "Sounds & Haptics", icon: Ph.speakerHigh.bold, tint: .pink),
        Row(label: "Focus", icon: Ph.moon.bold, tint: .indigo, toggle: \.focus),
        Row(label: "Screen Time", icon: Ph.hourglass.bold, tint: .indigo),
      ],
      [
        Row(label: "General", icon: Ph.gear.bold, tint: .gray),
        Row(label: "Display & Brightness", icon: Ph.sun.bold, tint: .blue),
      ],
    ]
  }

  private var onAccountPress: (() -> Void)?
  private var onRowPress: ((String) -> Void)?
  @State private var query: String
  @State private var toggles = Toggles()

  public init(onAccountPress: (() -> Void)? = nil, onRowPress: ((String) -> Void)? = nil) {
    self.init(query: "")
    self.onAccountPress = onAccountPress
    self.onRowPress = onRowPress
  }

  init(query: String) {
    _query = State(initialValue: query)
  }

  private var visible: [[Row]] {
    Self.groups
      .map { rows in rows.filter { query.isEmpty || $0.label.localizedCaseInsensitiveContains(query) } }
      .filter { !$0.isEmpty }
  }

  public var body: some View {
    Screen {
      HeaderScrollView {
        HeaderLargeTitle("Settings")
        VStack(spacing: 18) {
          InputGroup {
            InputGroupAddon {
              Ph.magnifyingGlass.bold.frame(width: 16, height: 16)
            }
            InputGroupInput("Search", text: $query)
              .submitLabel(.search)
              .accessibilityLabel(Text("Search settings"))
          }
          if query.isEmpty {
            ItemGroup(.inset) {
              Item(size: .sm, action: { onAccountPress?() }) {
                ItemMedia {
                  Avatar(size: .xl) {
                    Text(verbatim: "JR")
                      .scaledFont(.xl, weight: .semibold)
                      .foregroundStyle(Color.onAccent)
                      .frame(maxWidth: .infinity, maxHeight: .infinity)
                      .background(
                        Color.indigo,
                        in: Circle()
                      )
                  }
                  .frame(width: 58, height: 58)
                }
                ItemContent {
                  ItemTitle {
                    Text(verbatim: "Jamie Rivera")
                      .scaledFont(.xl, weight: .semibold)
                  }
                  ItemDescription("suiss Account, Cloud and more")
                }
                ItemActions {
                  SettingsDeviceChevron()
                }
              }
            }
          }
          ForEach(Array(visible.enumerated()), id: \.offset) { _, rows in
            ItemGroup(.inset) {
              ForEach(Array(rows.enumerated()), id: \.element.label) { index, row in
                if index > 0 {
                  Separator().padding(.leading, 57)
                }
                SettingsDeviceRow(row: row, toggles: $toggles, onPress: onRowPress)
              }
            }
          }
          if visible.isEmpty {
            Text("No Results")
              .scaledFont(.base)
              .foregroundStyle(Color.labelSecondary)
              .frame(maxWidth: .infinity)
              .padding(30)
          }
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 24)
      } header: {
        Header {
          HeaderTitle("Settings")
        }
      }
    }
  }
}

private struct SettingsDeviceRow: View {
  let row: SettingsDevice.Row
  @Binding var toggles: SettingsDevice.Toggles
  let onPress: ((String) -> Void)?

  var body: some View {
    if let key = row.toggle {
      Item(size: .sm) {
        media
        ItemContent {
          ItemTitle {
            Text(LocalizedStringKey(row.label)).fontWeight(.regular)
          }
        }
        ItemActions {
          Toggle(isOn: binding(key)) { Text(LocalizedStringKey(row.label)) }
            .labelsHidden()
            .accessibilityLabel(Text(LocalizedStringKey(row.label)))
          .toggleStyle(SwitchStyle())
        }
      }
    } else {
      Item(size: .sm, action: { onPress?(row.label) }) {
        media
        ItemContent {
          ItemTitle {
            Text(LocalizedStringKey(row.label)).fontWeight(.regular)
          }
        }
        ItemActions {
          if let detail = row.detail?(toggles) {
            Text(detail)
              .scaledFont(.base)
              .foregroundStyle(Color.labelSecondary)
          }
          SettingsDeviceChevron()
        }
      }
    }
  }

  private var media: some View {
    ItemMedia {
      row.icon
        .frame(width: 17, height: 17)
        .foregroundStyle(Color.onAccent)
        .frame(width: 29, height: 29)
        .background(row.tint, in: RoundedRectangle(cornerRadius: Radius.md, style: .continuous))
    }
  }

  private func binding(_ key: WritableKeyPath<SettingsDevice.Toggles, Bool>) -> Binding<Bool> {
    Binding(
      get: { toggles[keyPath: key] },
      set: { value in
        toggles[keyPath: key] = value
        if key == \SettingsDevice.Toggles.airplane && value {
          toggles.wifi = false
          toggles.bluetooth = false
        }
      }
    )
  }
}

private struct SettingsDeviceChevron: View {
  var body: some View {
    Ph.caretRight.bold
      .frame(width: 14, height: 14)
      .foregroundStyle(Color.labelTertiary)
      .flipsForRightToLeftLayoutDirection(true)
      .accessibilityHidden(true)
  }
}
