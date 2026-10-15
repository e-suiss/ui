import EsuissUI
import PhosphorSwift
import SwiftUI

enum TabBarStories {
  static let group = StoryGroup(.components, "Tab Bar", stories: [
    Story("Default", fullScreen: true) {
      TabBarExample()
    },
    Story("WithoutBadges", fullScreen: true) {
      TabBarExample(badges: false)
    },
    Story("LargeBadge", fullScreen: true) {
      LargeBadgeDemo()
    },
    Story("DisabledItem", fullScreen: true) {
      TabBarExample(disabled: "search")
    },
  ])
}

private struct TabBarEntry {
  let value: String
  let label: String
  let icon: Image
  let activeIcon: Image
  let badge: TabBarBadge?
}

private let tabBarEntries = [
  TabBarEntry(value: "home", label: "Home", icon: Ph.house.regular, activeIcon: Ph.house.fill, badge: nil),
  TabBarEntry(value: "search", label: "Search", icon: Ph.magnifyingGlass.regular, activeIcon: Ph.magnifyingGlass.fill, badge: nil),
  TabBarEntry(value: "messages", label: "Messages", icon: Ph.chatCircle.regular, activeIcon: Ph.chatCircle.fill, badge: 3),
  TabBarEntry(value: "profile", label: "Profile", icon: Ph.user.regular, activeIcon: Ph.user.fill, badge: .dot),
]

private struct TabBarPage<Bar: View>: View {
  let title: String
  @ViewBuilder let bar: () -> Bar

  var body: some View {
    VStack(spacing: 0) {
      VStack(alignment: .leading, spacing: 8) {
        Text(verbatim: title).textVariant(.h3)
        Text("Tap a tab to switch screens.").textVariant(.muted)
      }
      .padding(16)
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
      bar()
    }
    .background(EsuissColor.background.ignoresSafeArea())
  }
}

private struct TabBarExample: View {
  var badges = true
  var disabled: String?

  @State private var value = "home"

  var body: some View {
    TabBarPage(title: tabBarEntries.first { $0.value == value }?.label ?? "") {
      TabBar(selection: $value) {
        ForEach(tabBarEntries, id: \.value) { item in
          TabBarItem(
            verbatim: item.label,
            value: item.value,
            icon: item.icon,
            activeIcon: item.activeIcon,
            badge: badges ? item.badge : nil
          )
          .disabled(item.value == disabled)
        }
      }
    }
  }
}

private struct LargeBadgeDemo: View {
  @State private var value = "home"

  var body: some View {
    TabBarPage(title: "Home") {
      TabBar(selection: $value) {
        TabBarItem("Home", value: "home", icon: Ph.house.regular, activeIcon: Ph.house.fill)
        TabBarItem("Messages", value: "messages", icon: Ph.chatCircle.regular, activeIcon: Ph.chatCircle.fill, badge: 128)
        TabBarItem("Settings", value: "settings", icon: Ph.gearSix.regular, activeIcon: Ph.gearSix.fill, badge: "New")
      }
    }
  }
}
