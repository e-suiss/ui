import PhosphorSwift
import SwiftUI
import XCTest

@testable import EsuissUI

private struct DisclosureGallery: View {
  @State private var expanded: Set<String> = ["a"]
  @State private var filled: Set<String> = ["b"]
  @State private var collapsible = true
  @State private var tab = "account"
  @State private var line = "password"
  @State private var vertical = "general"

  var body: some View {
    VStack(alignment: .leading, spacing: 24) {
      Accordion(expanded: $expanded) {
        AccordionItem("Is it accessible?", value: "a") {
          Text("Yes. It adheres to the platform accessibility guidelines.")
        }
        AccordionItem("Is it styled?", value: "b") {
          Text("Yes. It comes with default styles.")
        }
        AccordionItem("Is it animated?", value: "c") {
          Text("Yes.")
        }
        .disabled(true)
      }
      Accordion(.filled, expanded: $filled, multiple: true) {
        AccordionItem("Shipping", value: "a") { Text("Ships in 2 days.") }
        AccordionItem("Returns", value: "b") { Text("Return within 30 days.") }
      }
      Collapsible(isExpanded: $collapsible, spacing: 8) {
        HStack {
          Text("@peduarte starred 3 repositories").font(TextStyle.sm.font(weight: .semibold))
          Spacer()
          CollapsibleTrigger {
            Ph.caretUpDown.regular.frame(width: 16, height: 16)
          }
          .buttonStyle(.variant(.ghost, size: .iconSm))
        }
        CollapsibleContent {
          Text("@acme/colors")
            .font(TextStyle.sm.font())
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .overlay(RoundedRectangle(cornerRadius: Radius.md).strokeBorder(Color.separator))
        }
      }
      .foregroundStyle(Color.label)
      Tabs(selection: $tab) {
        TabsList {
          TabsTrigger("Account", value: "account")
          TabsTrigger("Password", value: "password")
          TabsTrigger("Disabled", value: "disabled").disabled(true)
        }
        TabsContent(value: "account") {
          Text("Make changes to your account here.").font(TextStyle.sm.font()).foregroundStyle(Color.labelSecondary)
        }
      }
      Tabs(selection: $line) {
        TabsList(variant: .line) {
          TabsTrigger("Overview", value: "overview")
          TabsTrigger("Password", value: "password")
          TabsTrigger("Analytics", value: "analytics")
        }
      }
      Tabs(selection: $vertical, orientation: .vertical) {
        TabsList(variant: .line) {
          TabsTrigger("General", value: "general")
          TabsTrigger("Security", value: "security")
        }
        TabsContent(value: "general") {
          Text("General settings").font(TextStyle.sm.font()).foregroundStyle(Color.labelSecondary)
        }
      }
    }
    .padding(16)
    .frame(width: 402, alignment: .leading)
    .background(Color.surface)
  }
}

private struct BackdropPage: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      ForEach(0..<8) { _ in
        RoundedRectangle(cornerRadius: Radius.md).fill(Color.surfaceSecondary).frame(height: 40)
      }
    }
    .padding(16)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
    .background(Color.surface)
    .clipped()
  }
}

private struct DialogGallery: View {
  var body: some View {
    VStack(spacing: 0) {
      CenteredStage(visible: true, dismissible: true) {
        DialogContent {
          DialogHeader {
            DialogTitle("Edit profile")
            DialogDescription("Make changes to your profile here. Click save when you're done.")
          }
          Text("Name: Pedro Duarte").font(TextStyle.sm.font()).foregroundStyle(Color.label)
          DialogFooter(showCloseButton: true) {
            Button {} label: { Text("Save changes").frame(maxWidth: .infinity) }
              .buttonStyle(.variant())
          }
        }
      }
      .background(BackdropPage())
      .frame(height: 440)
      .clipped()
      CenteredStage(visible: true, dismissible: true) {
        DialogContent(closeLabel: "Done") {
          DialogHeader {
            DialogTitle("Share link")
            DialogDescription("Anyone with the link can view this.")
          }
        }
      }
      .background(BackdropPage())
      .frame(height: 260)
      .clipped()
      CenteredStage(visible: true, dismissible: false) {
        AlertDialogContent {
          AlertDialogHeader {
            AlertDialogMedia { Ph.trash.regular }
            AlertDialogTitle("Delete chat?")
            AlertDialogDescription("This will permanently delete this chat conversation.")
          }
          AlertDialogFooter {
            AlertDialogCancel()
            AlertDialogAction("Delete", variant: .destructive)
          }
        }
      }
      .background(BackdropPage())
      .frame(height: 420)
      .clipped()
      CenteredStage(visible: true, dismissible: false) {
        AlertDialogContent(size: .sm) {
          AlertDialogHeader {
            AlertDialogTitle("Allow accessory to connect?")
            AlertDialogDescription("Do you want to allow the USB accessory to connect to this device?")
          }
          AlertDialogFooter {
            AlertDialogCancel("Don't allow")
            AlertDialogAction("Allow")
          }
        }
      }
      .background(BackdropPage())
      .frame(height: 300)
      .clipped()
    }
    .frame(width: 402)
  }
}

private struct SheetGallery: View {
  var body: some View {
    VStack(spacing: 0) {
      SideSheetStage(side: .trailing, visible: true) {
        SheetContent {
          SheetHeader {
            SheetTitle("Edit profile")
            SheetDescription("Make changes to your profile here.")
          }
          Text("Content").font(TextStyle.sm.font()).foregroundStyle(Color.label).padding(.horizontal, 24)
          SheetFooter {
            Button {} label: { Text("Save changes").frame(maxWidth: .infinity) }.buttonStyle(.variant())
            SheetClose { Text("Close").frame(maxWidth: .infinity) }.buttonStyle(.variant(.outline))
          }
        }
      }
      .background(BackdropPage())
      .frame(height: 520)
      .clipped()
      SideSheetStage(side: .bottom, visible: true) {
        SheetContent(closeLabel: "Done") {
          SheetHeader {
            SheetTitle("Bottom sheet")
            SheetDescription("Slides in from the bottom edge.")
          }
        }
      }
      .background(BackdropPage())
      .frame(height: 300)
      .clipped()
      ZStack(alignment: .bottom) {
        BackdropPage()
        Color.scrim
        DrawerContent(showCloseButton: true) {
          DrawerHeader {
            DrawerTitle("Move goal")
            DrawerDescription("Set your daily activity goal.")
          }
          Text("350 calories / day")
            .font(TextStyle.xl2.font(weight: .bold))
            .foregroundStyle(Color.label)
            .frame(maxWidth: .infinity)
            .padding(24)
          DrawerFooter {
            Button {} label: { Text("Submit").frame(maxWidth: .infinity) }.buttonStyle(.variant())
            DrawerClose { Text("Cancel").frame(maxWidth: .infinity) }.buttonStyle(.variant(.outline))
          }
        }
        .environment(\.drawerFitsContent, true)
        .overlay(alignment: .top) {
          Capsule().fill(Color.labelQuaternary).frame(width: 36, height: 5).padding(.top, 5)
        }
        .clipShape(UnevenRoundedRectangle(topLeadingRadius: Radius.xl3, topTrailingRadius: Radius.xl3, style: .continuous))
      }
      .frame(height: 420)
      .clipped()
    }
    .frame(width: 402)
  }
}

private struct PopoverGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 24) {
      PopoverContent {
        PopoverHeader {
          PopoverTitle("Dimensions")
          PopoverDescription("Set the dimensions for the layer.")
        }
        Text("Width 100%").font(TextStyle.sm.font())
      }
      .popupSurface(radius: 13)
    }
    .padding(24)
    .frame(width: 402, alignment: .leading)
    .background(Color.surface)
  }
}

private struct ToastGallery: View {
  var body: some View {
    VStack(spacing: 16) {
      ToastCard(item: item(.default, "Event has been created", "Sunday, December 03, 2023", action: true)) {}
      ToastCard(item: item(.success, "Profile saved")) {}
      ToastCard(item: item(.info, "Update available", "Version 2.0 is ready.")) {}
      ToastCard(item: item(.warning, "Storage almost full")) {}
      ToastCard(item: item(.error, "Upload failed", "Check your connection.")) {}
      ToastCard(item: item(.loading, "Uploading…")) {}
    }
    .padding(16)
    .frame(width: 402)
    .background(Color.surface)
  }

  private func item(
    _ type: ToastType,
    _ title: LocalizedStringResource,
    _ description: LocalizedStringResource? = nil,
    action: Bool = false
  ) -> ToastItem {
    ToastItem(
      id: UUID(),
      type: type,
      title: title,
      description: description,
      action: action ? ToastAction("Undo") {} : nil,
      duration: nil
    )
  }
}

private struct MenusGallery: View {
  @State private var statusBar = true
  @State private var panel = false
  @State private var position = "bottom"
  @State private var fruit: String? = "banana"
  @State private var empty: String? = nil
  @State private var framework: String? = "Next.js"
  @State private var frameworks: [String] = ["Next.js", "SvelteKit", "Nuxt.js"]

  private let all = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      HStack(alignment: .top, spacing: 12) {
        MenuPanel {
          DropdownMenuLabel("My Account")
          DropdownMenuGroup {
            DropdownMenuItem("Profile", icon: Ph.user.regular) {}
            DropdownMenuItem("Billing", icon: Ph.creditCard.regular) {}
            DropdownMenuItem("Disabled", icon: Ph.gear.regular) {}.disabled(true)
          }
          DropdownMenuSeparator()
          DropdownMenuSub("Invite users", icon: Ph.userPlus.regular) {
            DropdownMenuItem("Email") {}
          }
          DropdownMenuSeparator()
          DropdownMenuItem("Log out", icon: Ph.signOut.regular, variant: .destructive) {}
        }
        .frame(width: 200)
        MenuPanel {
          DropdownMenuLabel("Appearance")
          DropdownMenuCheckboxItem("Status Bar", isOn: $statusBar)
          DropdownMenuCheckboxItem("Panel", isOn: $panel)
          DropdownMenuSeparator()
          DropdownMenuLabel("Position")
          DropdownMenuRadioGroup(selection: $position) {
            DropdownMenuRadioItem("Top", value: "top")
            DropdownMenuRadioItem("Bottom", value: "bottom")
          }
        }
        .frame(width: 160)
      }
      HStack(alignment: .top, spacing: 12) {
        VStack(alignment: .leading, spacing: 4) {
          fruitSelect(selection: $fruit)
          SelectPanel {
            SelectGroup {
              SelectLabel("Fruits")
              SelectItem("Cherry", value: "cherry")
              SelectItem("Banana", value: "banana")
            }
            SelectSeparator()
            SelectGroup {
              SelectItem("Carrot", value: "carrot")
            }
          }
          .environment(\.select, SelectContext(selected: AnyHashable("banana")))
        }
        VStack(alignment: .leading, spacing: 12) {
          fruitSelect(selection: $empty)
          fruitSelect(selection: $empty, size: .sm).invalid()
          fruitSelect(selection: $fruit).disabled(true)
        }
      }
      Combobox(all, selection: $framework, placeholder: "Select framework")
      ComboboxPanel(
        items: all,
        single: $framework,
        multiple: nil,
        searchPlaceholder: "Search",
        emptyText: "No items found.",
        title: { $0 },
        initialQuery: "s",
        autofocus: false
      )
      .frame(width: 280)
      Combobox(all, selection: $frameworks, placeholder: "Add frameworks")
      Combobox(all, selection: Binding<[String]>.constant([]), placeholder: "Add frameworks").invalid()
    }
    .padding(16)
    .frame(width: 402, alignment: .leading)
    .background(Color.surface)
  }

  private func fruitSelect(selection: Binding<String?>, size: SelectSize = .default) -> some View {
    SelectField(selection: selection, placeholder: "Select a fruit", size: size) {
      SelectItem("Cherry", value: "cherry")
      SelectItem("Banana", value: "banana")
    }
  }
}

@MainActor
final class OverlaysGalleryTests: XCTestCase {
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

  func testRendersDisclosureGallery() throws {
    try render(DisclosureGallery(), name: "overlays-disclosure")
  }

  func testRendersDialogGallery() throws {
    try render(DialogGallery(), name: "overlays-dialog")
  }

  func testRendersSheetGallery() throws {
    try render(SheetGallery(), name: "overlays-sheet")
  }

  func testRendersPopoverGallery() throws {
    try render(PopoverGallery(), name: "overlays-popover")
  }

  func testRendersToastGallery() throws {
    try render(ToastGallery(), name: "overlays-toast")
  }

  func testRendersMenusGallery() throws {
    try render(MenusGallery(), name: "overlays-menus")
  }

  func testToastManagerLifecycle() {
    let manager = ToastManager()
    let id = manager.loading("Uploading")
    XCTAssertEqual(manager.toasts.count, 1)
    XCTAssertNil(manager.toasts.first?.duration)
    manager.update(id, title: "Uploaded", type: .success)
    XCTAssertEqual(manager.toasts.first?.type, .success)
    XCTAssertNotNil(manager.toasts.first?.duration)
    manager.error("Failed")
    XCTAssertEqual(manager.toasts.count, 2)
    manager.dismiss(id)
    XCTAssertEqual(manager.toasts.count, 1)
    manager.dismissAll()
    XCTAssertTrue(manager.toasts.isEmpty)
  }
}
