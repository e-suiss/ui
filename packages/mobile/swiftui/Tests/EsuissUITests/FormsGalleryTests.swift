import PhosphorSwift
import SwiftUI
import XCTest

@testable import EsuissUI

private struct TypographyGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      ForEach(TextVariant.allCases, id: \.self) { variant in
        Text(verbatim: String(describing: variant)).textVariant(variant)
      }
      Separator()
      HStack(spacing: 12) {
        Text(verbatim: "Left").textVariant(.small)
        Separator(.vertical)
        Text(verbatim: "Right").textVariant(.small)
      }
      .frame(height: 20)
      FieldLabel("Field label")
      FieldLabel("Disabled label").disabled(true)
      HStack(spacing: 12) {
        Skeleton(cornerRadius: Radius.full).frame(width: 40, height: 40)
        VStack(alignment: .leading, spacing: 8) {
          Skeleton().frame(width: 200, height: 14)
          Skeleton().frame(width: 140, height: 14)
        }
      }
      AspectRatio(ratio: 16 / 9) {
        LinearGradient(colors: [EsuissColor.primary, Color.adaptive(light: EsuissColor.primary.opacity(0.1), dark: EsuissColor.primary.opacity(0.2))], startPoint: .topLeading, endPoint: .bottomTrailing)
      }
      .clipShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
      HStack(alignment: .center, spacing: 12) {
        ForEach(AvatarSize.allCases, id: \.self) { size in
          Avatar(size: size) {
            AvatarFallback("CN")
            AvatarBadge(icon: Ph.check.bold)
          }
        }
        Avatar(size: .lg) {
          AvatarFallback(icon: Ph.user.regular)
        }
      }
      AvatarGroup {
        Avatar(url: nil, initials: "AB")
        Avatar(url: nil, initials: "CD")
        Avatar(url: nil, initials: "EF")
        AvatarGroupCount("+3")
      }
      AvatarGroup {
        Avatar(url: nil, initials: "AB", size: .xl)
        Avatar(url: nil, initials: "CD", size: .xl)
        AvatarGroupCount(size: .xl) { AvatarIcon(Ph.plus.regular) }
      }
      ProgressView(value: 0.66) {
        Text(verbatim: "Upload")
      } currentValueLabel: {
        Text(verbatim: "66%")
      }
      .progressViewStyle(.bar)
      ProgressView(value: 0.3).progressViewStyle(.bar)
      InlineAlert(icon: Ph.info.regular) {
        AlertTitle("Heads up")
        AlertDescription("You can add components to your app using the library.")
      }
      InlineAlert(.destructive, icon: Ph.warning.regular) {
        AlertTitle("Something went wrong")
        AlertDescription("Your session has expired. Please log in again.")
      } action: {
        Button("Retry") {}.buttonStyle(.variant(.outline, size: .xs))
      }
    }
  }
}

private struct FormsGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Field {
        FieldLabel("Email")
        TextField("Email", text: .constant(""), prompt: Text(verbatim: "you@example.com"))
          .textFieldStyle(.input)
        FieldDescription("We will never share your email.")
      }
      HStack(spacing: 8) {
        TextField("MD", text: .constant("Medium")).textFieldStyle(.input(size: .md))
        TextField("SM", text: .constant("Small")).textFieldStyle(.input(size: .sm))
      }
      Field(invalid: true) {
        FieldLabel("Username")
        TextField("Username", text: .constant("taken")).textFieldStyle(.input)
        FieldError(errors: ["Username is taken", "Too short", "Too short"])
      }
      TextField("Disabled", text: .constant("Disabled")).textFieldStyle(.input).disabled(true)
      TextField("Bio", text: .constant("A few lines about yourself"), axis: .vertical)
        .textFieldStyle(.textarea)
      FieldSet {
        FieldLegend("Settings")
        FieldGroup(.inset) {
          Field(orientation: .horizontal) {
            FieldLabel("Wi-Fi")
            Spacer()
            Toggle(isOn: .constant(true)) { EmptyView() }.toggleStyle(.switch(size: .default))
          }
          Field(orientation: .horizontal) {
            FieldLabel("Bluetooth")
            Spacer()
            Toggle(isOn: .constant(false)) { EmptyView() }.toggleStyle(.switch(size: .default))
          }
        }
        FieldDescription("Inset group footnote.")
      }
      FieldSeparator("Or continue with")
      InputOTP(text: .constant("123"), length: 6) {
        InputOTPGroup {
          InputOTPSlot(index: 0)
          InputOTPSlot(index: 1)
          InputOTPSlot(index: 2)
        }
        InputOTPSeparator()
        InputOTPGroup {
          InputOTPSlot(index: 3)
          InputOTPSlot(index: 4)
          InputOTPSlot(index: 5)
        }
      }
    }
  }
}

private struct ControlsGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      HStack(spacing: 20) {
        Toggle(isOn: .constant(true)) { FieldLabel("On") }
        Toggle(isOn: .constant(false)) { FieldLabel("Off") }
        Toggle(sources: [Binding.constant(true), .constant(false)], isOn: \.self) { FieldLabel("Mixed") }
      }
      .toggleStyle(.checkbox)
      HStack(spacing: 20) {
        Toggle(isOn: .constant(false)) { FieldLabel("Invalid") }.invalid()
        Toggle(isOn: .constant(true)) { FieldLabel("Disabled") }.disabled(true)
        Toggle(isOn: .constant(false)) { FieldLabel("Off") }.disabled(true)
      }
      .toggleStyle(.checkbox)
      RadioGroup(selection: .constant("comfortable")) {
        RadioGroupItem("Default", value: "default")
        RadioGroupItem("Comfortable", value: "comfortable")
        RadioGroupItem("Compact", value: "compact").invalid()
      }
      HStack(spacing: 16) {
        Toggle(isOn: .constant(true)) { EmptyView() }.toggleStyle(.switch(size: .default))
        Toggle(isOn: .constant(false)) { EmptyView() }.toggleStyle(.switch(size: .default))
        Toggle(isOn: .constant(true)) { EmptyView() }.toggleStyle(.switch(size: .sm))
        Toggle(isOn: .constant(false)) { EmptyView() }.toggleStyle(.switch(size: .sm))
        Toggle(isOn: .constant(false)) { EmptyView() }.toggleStyle(.switch(size: .default)).invalid()
        Toggle(isOn: .constant(true)) { EmptyView() }.toggleStyle(.switch(size: .default)).disabled(true)
      }
      Toggle(isOn: .constant(true)) { FieldLabel("Airplane mode") }.toggleStyle(.switch(size: .default))
      ValueSlider(value: .constant(0.4))
      RangeSlider(value: .constant(20...70), in: 0...100)
      ValueSlider(value: .constant(0.6)).disabled(true)
      HStack(spacing: 8) {
        Toggle(isOn: .constant(true)) {
          Label { Text(verbatim: "Bold") } icon: { Ph.textB.bold }
        }
        .toggleStyle(.variant())
        Toggle(isOn: .constant(false)) { Text(verbatim: "Italic") }.toggleStyle(.variant())
        Toggle(isOn: .constant(true)) { Text(verbatim: "Outline") }.toggleStyle(.variant(.outline))
        Toggle(isOn: .constant(false)) { Text(verbatim: "SM") }.toggleStyle(.variant(.outline, size: .sm))
        Toggle(isOn: .constant(true)) { Text(verbatim: "LG") }.toggleStyle(.variant(size: .lg)).disabled(true)
      }
      ToggleGroup(selection: .constant(Set(["b"])), variant: .outline) {
        ToggleGroupItem("Bold", value: "b")
        ToggleGroupItem("Italic", value: "i")
        ToggleGroupItem("Under", value: "u")
      }
      ToggleGroup(selection: .constant(Optional("week")), spacing: 0) {
        ToggleGroupItem("Day", value: "day")
        ToggleGroupItem("Week", value: "week")
        ToggleGroupItem("Month", value: "month")
      }
      ToggleGroup(selection: .constant(Set(["i"])), variant: .outline, spacing: 0) {
        ToggleGroupItem(value: "b") { Ph.textB.bold.frame(width: 16, height: 16) }
        ToggleGroupItem(value: "i") { Ph.textItalic.bold.frame(width: 16, height: 16) }
        ToggleGroupItem(value: "u") { Ph.textUnderline.bold.frame(width: 16, height: 16) }
      }
      ToggleGroup(selection: .constant(Optional("a")), spacing: 0, orientation: .vertical) {
        ToggleGroupItem("Alpha", value: "a")
        ToggleGroupItem("Beta", value: "b")
      }
      .frame(width: 160)
    }
  }
}

@MainActor
final class FormsGalleryTests: XCTestCase {
  private func render<V: View>(_ view: V, name: String) throws {
    let output = ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
    for scheme in [ColorScheme.light, .dark] {
      let content = view
        .padding(16)
        .frame(width: 402, alignment: .leading)
        .background(EsuissColor.background)
        .environment(\.locale, Locale(identifier: "en_US"))
        .environment(\.colorScheme, scheme)
      let renderer = ImageRenderer(content: content)
      renderer.scale = 3
      let image = try XCTUnwrap(renderer.uiImage)
      let data = try XCTUnwrap(image.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  func testRendersTypographyGallery() throws {
    try render(TypographyGallery(), name: "forms-typography")
  }

  func testRendersFormsGallery() throws {
    try snapshot(FormsGallery(), name: "forms-inputs")
  }

  private func snapshot<V: View>(_ view: V, name: String) throws {
    let output = ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
    for scheme in [ColorScheme.light, .dark] {
      let host = UIHostingController(rootView: view
        .padding(16)
        .frame(width: 402, alignment: .leading)
        .background(EsuissColor.background)
        .environment(\.locale, Locale(identifier: "en_US")))
      host.safeAreaRegions = []
      let size = host.sizeThatFits(in: CGSize(width: 402, height: CGFloat.greatestFiniteMagnitude))
      let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
      let window = scene.map { UIWindow(windowScene: $0) } ?? UIWindow()
      window.frame = CGRect(origin: .zero, size: size)
      window.overrideUserInterfaceStyle = scheme == .dark ? .dark : .light
      window.rootViewController = host
      window.makeKeyAndVisible()
      host.view.frame = window.bounds
      host.view.layoutIfNeeded()
      RunLoop.main.run(until: Date().addingTimeInterval(0.3))
      let format = UIGraphicsImageRendererFormat()
      format.scale = 3
      let image = UIGraphicsImageRenderer(size: size, format: format).image {
        host.view.layer.render(in: $0.cgContext)
      }
      window.isHidden = true
      let data = try XCTUnwrap(image.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  func testRendersControlsGallery() throws {
    try render(ControlsGallery(), name: "forms-controls")
  }
}
