import PhosphorSwift
import SwiftUI
import XCTest

@testable import EsuissUI

private struct ListsBackdrop: View {
  var body: some View {
    Color.surface
      .overlay(alignment: .top) {
        VStack(alignment: .leading, spacing: 12) {
          ForEach(0..<14) { _ in
            RoundedRectangle(cornerRadius: Radius.md).fill(Color.surfaceSecondary).frame(height: 40)
          }
        }
        .padding(16)
      }
      .clipped()
  }
}

private struct ItemsGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 20) {
      ItemGroup {
        Item(.outline) {
          ItemContent {
            ItemTitle("Basic Item")
            ItemDescription("A simple item with title and description.")
          }
          ItemActions {
            Button("Action") {}.buttonStyle(.variant(.outline, size: .sm))
          }
        }
        Item(.outline, size: .sm, action: {}) {
          ItemMedia(.icon) { Ph.sealCheck.regular }
          ItemContent {
            ItemTitle("Your profile has been verified.")
          }
          ItemActions {
            Ph.caretRight.regular.frame(width: 16, height: 16).foregroundStyle(Color.labelSecondary)
          }
        }
        Item(.muted) {
          ItemMedia(.image) {
            LinearGradient(colors: [.accent, .danger], startPoint: .topLeading, endPoint: .bottomTrailing)
          }
          ItemContent {
            ItemTitle {
              Text("Midnight City Lights")
              Badge("New", variant: .secondary)
            }
            ItemDescription("Neon Dreams · 3:45 with a long description that should wrap onto a second line and then clamp.")
          }
          ItemContent {
            ItemDescription("3:45")
          }
        }
        Item(.outline, size: .xs) {
          ItemHeader {
            Text("Header").font(TextStyle.xs.font(weight: .semibold))
            Badge("Pro", variant: .outline)
          }
          ItemMedia(.icon) { Ph.bell.regular }
          ItemContent {
            ItemTitle("Extra small item")
          }
          ItemFooter {
            Text("Footer").font(TextStyle.xs.font()).foregroundStyle(Color.labelSecondary)
            Text("2m ago").font(TextStyle.xs.font()).foregroundStyle(Color.labelSecondary)
          }
        }
      }
      ItemGroup(.inset) {
        Item(action: {}) {
          ItemMedia(.icon) { Ph.wifiHigh.regular }
          ItemContent { ItemTitle("Wi-Fi") }
          ItemActions { Text("Home").foregroundStyle(Color.labelSecondary) }
        }
        ItemSeparator()
        Item {
          ItemMedia(.icon) { Ph.bluetooth.regular }
          ItemContent { ItemTitle("Bluetooth") }
          ItemActions { Text("On").foregroundStyle(Color.labelSecondary) }
        }
      }
      HStack(spacing: 16) {
        ForEach(Spinner.Size.allCases, id: \.self) { size in
          Spinner(size).foregroundStyle(Color.labelSecondary)
        }
        Button {} label: {
          Label { Text("Loading") } icon: { Spinner() }
        }
        .buttonStyle(.variant(size: .sm))
        .disabled(true)
        SpinnerSpokes(dimension: 24, progress: 0.5).foregroundStyle(Color.labelSecondary)
      }
      Marker("Today", icon: Ph.calendar.regular)
      Marker("New messages", variant: .separator)
      Marker(.border) {
        MarkerIcon { Ph.pushPin.regular }
        MarkerContent("Pinned")
      }
    }
    .padding(16)
    .frame(width: 402, alignment: .leading)
    .background(Color.surface)
  }
}

private struct InputsGallery: View {
  @State private var query = ""
  @State private var url = "example"
  @State private var message = ""
  @State private var amount = "12.50"

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Empty {
        EmptyHeader {
          EmptyMedia(.icon) { Ph.folder.regular }
          EmptyTitle("No Projects Yet")
          EmptyDescription("You haven't created any projects yet. Get started by creating your first project.")
        }
        EmptyContent {
          HStack(spacing: 8) {
            Button("Create Project") {}.buttonStyle(.variant(size: .sm))
            Button("Import Project") {}.buttonStyle(.variant(.outline, size: .sm))
          }
        }
      }
      .fixedSize(horizontal: false, vertical: true)
      .background(Color.surfaceSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: Radius.xl2))
      InputGroup {
        InputGroupInput("Search...", text: $query)
        InputGroupAddon { Ph.magnifyingGlass.regular.frame(width: 16, height: 16) }
        InputGroupAddon(align: .inlineEnd) { Text("12 results") }
      }
      InputGroup {
        InputGroupAddon { InputGroupText("https://") }
        InputGroupInput("example.com", text: $url)
        InputGroupAddon(align: .inlineEnd) {
          InputGroupButton(size: .iconXs) {} label: {
            Ph.info.regular.frame(width: 16, height: 16)
          }
        }
      }
      InputGroup {
        InputGroupAddon { InputGroupText("$") }
        InputGroupInput("0.00", text: $amount)
        InputGroupAddon(align: .inlineEnd) { InputGroupText("USD") }
      }
      .invalid()
      InputGroup {
        InputGroupTextarea("Ask, search or chat...", text: $message)
        InputGroupAddon(align: .blockEnd) {
          InputGroupButton(variant: .outline, size: .iconXs) {} label: {
            Ph.plus.regular.frame(width: 14, height: 14)
          }
          InputGroupText("52% used")
          Spacer()
          InputGroupButton("Send", variant: .default) {}
        }
      }
      InputGroup {
        InputGroupInput("Disabled", text: .constant(""))
        InputGroupAddon(align: .inlineEnd) { InputGroupButton("Copy") {} }
      }
      .disabled(true)
    }
    .padding(16)
    .frame(width: 402, alignment: .leading)
    .background(Color.surface)
  }
}

private struct ConfirmGallery: View {
  var body: some View {
    VStack(spacing: 0) {
      AlertSheetStage(visible: true, dismissible: true) {
        AlertSheetContent {
          AlertSheetGroup {
            AlertSheetHeader {
              AlertSheetTitle("Delete this photo?")
              AlertSheetDescription("This photo will be deleted from all your devices.")
            }
            AlertSheetAction("Delete Photo", icon: Ph.trash.regular, variant: .destructive)
            AlertSheetAction("Duplicate", icon: Ph.copy.regular)
            AlertSheetAction("Disabled").disabled(true)
          }
          AlertSheetCancel()
        }
      }
      .background(ListsBackdrop())
      .frame(height: 520)
      .clipped()
      AlertSheetStage(visible: true, dismissible: false) {
        ConfirmContent {
          ConfirmHeader {
            ConfirmTitle("Discard draft?")
            ConfirmDescription("Your changes will be lost.")
          }
          ConfirmFooter {
            ConfirmCancel("Keep Editing")
            ConfirmAction("Discard", variant: .destructive)
          }
        }
      }
      .background(ListsBackdrop())
      .frame(height: 380)
      .clipped()
      CenteredStage(visible: true, dismissible: false) {
        ConfirmContent(size: .sm) {
          ConfirmHeader {
            ConfirmTitle("Discard draft?")
            ConfirmDescription("Your changes will be lost.")
          }
          ConfirmFooter {
            ConfirmCancel()
            ConfirmAction("Discard", variant: .destructive)
          }
        }
      }
      .environment(\.horizontalSizeClass, .regular)
      .background(ListsBackdrop())
      .frame(height: 300)
      .clipped()
    }
    .frame(width: 402)
  }
}

private struct Device: Identifiable {
  let id: Int
  let name: String
  let model: String
  let owner: String
  let storage: String
}

private struct ListsGallery: View {
  @State private var fruit: String? = "banana"
  @State private var empty: String? = nil

  private let devices = [
    Device(id: 1, name: "Adem's iPhone", model: "iPhone 17 Pro", owner: "Adem", storage: "512 GB"),
    Device(id: 2, name: "Studio", model: "Mac Studio", owner: "Team", storage: "2 TB"),
    Device(id: 3, name: "Travel iPad", model: "iPad Air", owner: "Adem", storage: "256 GB"),
  ]

  var body: some View {
    VStack(alignment: .leading, spacing: 20) {
      TableList(devices, columns: [
        TableListColumn("name", header: "Name", slot: .title) { Text(verbatim: $0.name) },
        TableListColumn("model", header: "Model", slot: .description) { Text(verbatim: $0.model) },
        TableListColumn("owner", header: "Owner", slot: .description) { Text(verbatim: $0.owner) },
        TableListColumn("storage", header: "Storage", slot: .trailing) { Text(verbatim: $0.storage) },
      ], title: "Devices", action: { _ in })
      TableList([Device](), columns: [], emptyText: "No devices.")
      TableListSection(header: "Connectivity", footer: "Devices nearby can discover this phone.") {
        Item(size: .sm, action: {}) {
          ItemMedia(.icon) { Ph.airplane.regular }
          ItemContent { ItemTitle("Airplane Mode") }
        }
        ItemSeparator()
        TableListRow {
          Text("Personal Hotspot").foregroundStyle(Color.label)
          Spacer()
          Text("Off").foregroundStyle(Color.labelSecondary)
        }
        TableListRow {
          Text("VPN").foregroundStyle(Color.label)
          Spacer()
          Text("Connected").foregroundStyle(Color.labelSecondary)
        }
      }
      HStack(spacing: 8) {
        picker(selection: $fruit)
        picker(selection: $empty).invalid()
      }
      VStack(spacing: 0) {
        SwipeActions(revealed: -144) {
          row("Trailing actions revealed")
        } leading: {
          EmptyView()
        } trailing: {
          SwipeAction("Archive", icon: Ph.archive.regular, variant: .archive) {}
          SwipeAction("Delete", icon: Ph.trash.regular, variant: .destructive, fullSwipe: true) {}
        }
        SwipeActions(revealed: 144) {
          row("Leading actions revealed")
        } leading: {
          SwipeAction("Pin", icon: Ph.pushPin.regular) {}
          SwipeAction("More", icon: Ph.dotsThree.regular, variant: .neutral) {}
        } trailing: {
          EmptyView()
        }
        SwipeActions(revealed: -300, full: .trailing) {
          row("Full swipe")
        } leading: {
          EmptyView()
        } trailing: {
          SwipeAction("Archive", icon: Ph.archive.regular, variant: .archive) {}
          SwipeAction("Delete", icon: Ph.trash.regular, variant: .destructive, fullSwipe: true) {}
        }
        SwipeActions {
          row("Closed")
        } trailing: {
          SwipeAction("Delete", variant: .destructive) {}
        }
      }
    }
    .padding(16)
    .frame(width: 402, alignment: .leading)
    .background(Color.surface)
  }

  private func row(_ title: LocalizedStringKey) -> some View {
    Text(title)
      .font(TextStyle.base.font())
      .foregroundStyle(Color.label)
      .padding(.horizontal, 16)
      .frame(maxWidth: .infinity, minHeight: 64, alignment: .leading)
      .overlay(alignment: .bottom) { Rectangle().fill(Color.separator).frame(height: 1) }
  }

  private func picker(selection: Binding<String?>) -> some View {
    OptionPicker(selection: selection, placeholder: "Select a fruit") {
      OptionPickerGroup("Fruits") {
        OptionPickerItem("Mango", value: "mango")
        OptionPickerItem("Banana", value: "banana")
      }
      OptionPickerSeparator()
      OptionPickerItem("Cherry", value: "cherry")
    }
  }
}

private struct AdaptiveGallery: View {
  var body: some View {
    VStack(spacing: 0) {
      ZStack(alignment: .bottom) {
        ListsBackdrop()
        Color.scrim
        ModalContent {
          ModalHeader {
            ModalTitle("Edit profile")
            ModalDescription("Make changes to your profile here.")
          }
          ModalBody {
            Text("Name: Pedro Duarte").font(TextStyle.sm.font()).foregroundStyle(Color.label)
          }
          ModalFooter {
            Button {} label: { Text("Save").frame(maxWidth: .infinity) }.buttonStyle(.variant())
            ModalClose { Text("Cancel").frame(maxWidth: .infinity) }.buttonStyle(.variant(.outline))
          }
        }
        .environment(\.drawerFitsContent, true)
        .clipShape(UnevenRoundedRectangle(topLeadingRadius: Radius.xl3, topTrailingRadius: Radius.xl3, style: .continuous))
      }
      .frame(height: 400)
      .clipped()
      CenteredStage(visible: true, dismissible: true) {
        ModalContent {
          ModalHeader {
            ModalTitle("Edit profile")
            ModalDescription("Make changes to your profile here.")
          }
          ModalBody {
            Text("Name: Pedro Duarte").font(TextStyle.sm.font()).foregroundStyle(Color.label)
          }
          ModalFooter {
            Button {} label: { Text("Save").frame(maxWidth: .infinity) }.buttonStyle(.variant())
          }
        }
      }
      .environment(\.patternCompact, false)
      .background(ListsBackdrop())
      .frame(height: 320)
      .clipped()
      SideSheetStage(side: .trailing, visible: true) {
        PanelContent {
          PanelHeader {
            PanelTitle("Filters")
            PanelDescription("Narrow down results.")
          }
          PanelBody {
            Text("Content").font(TextStyle.sm.font()).foregroundStyle(Color.label)
          }
          PanelFooter {
            Button {} label: { Text("Apply").frame(maxWidth: .infinity) }.buttonStyle(.variant())
          }
        }
      }
      .environment(\.patternCompact, false)
      .background(ListsBackdrop())
      .frame(height: 400)
      .clipped()
      ZStack(alignment: .bottom) {
        ListsBackdrop()
        Color.scrim
        FlyoutContent(showCloseButton: true) {
          FlyoutHeader {
            FlyoutTitle("Dimensions")
            FlyoutDescription("Set the dimensions for the layer.")
          }
          FlyoutBody {
            Text("Width 100%").font(TextStyle.sm.font()).foregroundStyle(Color.label)
          }
        }
        .environment(\.drawerFitsContent, true)
        .clipShape(UnevenRoundedRectangle(topLeadingRadius: Radius.xl3, topTrailingRadius: Radius.xl3, style: .continuous))
      }
      .frame(height: 300)
      .clipped()
    }
    .frame(width: 402)
  }
}

@MainActor
final class ListsGalleryTests: XCTestCase {
  private func render<V: View>(_ view: V, name: String) throws {
    let output = ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
    for scheme in [ColorScheme.light, .dark] {
      let renderer = ImageRenderer(content: view.environment(\.colorScheme, scheme))
      renderer.scale = 3
      let image = try XCTUnwrap(renderer.uiImage)
      let data = try XCTUnwrap(image.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  func testRendersItemsGallery() throws {
    try render(ItemsGallery(), name: "lists-items")
  }

  func testRendersInputsGallery() throws {
    try render(InputsGallery(), name: "lists-inputs")
  }

  func testRendersConfirmGallery() throws {
    try render(ConfirmGallery(), name: "lists-confirm")
  }

  func testRendersListsGallery() throws {
    try render(ListsGallery(), name: "lists-lists")
  }

  func testRendersAdaptiveGallery() throws {
    try render(AdaptiveGallery(), name: "lists-adaptive")
  }

  func testRefreshTimingWaitsForMinimum() async {
    let clock = ContinuousClock()
    let started = clock.now
    await PullToRefreshTiming.run {}
    XCTAssertGreaterThanOrEqual(clock.now - started, .milliseconds(590))
  }
}
