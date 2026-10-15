import PhosphorSwift
import SwiftUI
import UIKit
import XCTest

@testable import EsuissUI

private struct Caption: View {
  let text: String

  var body: some View {
    Text(verbatim: text)
      .font(TextStyle.xs.font(weight: .semibold))
      .foregroundStyle(EsuissColor.mutedForeground)
      .frame(maxWidth: .infinity, alignment: .leading)
  }
}

private struct GallerySection<Content: View>: View {
  let title: String
  let content: Content

  init(_ title: String, @ViewBuilder content: () -> Content) {
    self.title = title
    self.content = content()
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Caption(text: title)
      content
    }
  }
}

private let onboardingItems = [
  QuestionnaireItemDefinition("role", required: true),
  QuestionnaireItemDefinition("team-size"),
  QuestionnaireItemDefinition("company", required: true),
]

private struct OnboardingQuestionnaire: View {
  let controller: QuestionnaireController

  var body: some View {
    Questionnaire(controller: controller) {
      QuestionnaireProgress()
      QuestionnaireItem(name: "role", required: true) {
        QuestionnaireTitle("What best describes your role?")
        QuestionnaireDescription("This helps us tailor the setup to your team.")
        QuestionnaireChoices {
          QuestionnaireChoice("Engineering", value: "engineering")
          QuestionnaireChoice("Design", value: "design")
          QuestionnaireChoice("Product", value: "product")
          QuestionnaireChoice("Something else", value: "other")
        }
        QuestionnaireError()
      }
      QuestionnaireItem(name: "team-size") {
        QuestionnaireTitle("How large is your team?")
        QuestionnaireChoices {
          QuestionnaireChoice("Just me", value: "solo")
          QuestionnaireChoice("2 to 10 people", value: "small")
          QuestionnaireChoice("11 to 50 people", value: "medium")
          QuestionnaireChoice("More than 50 people", value: "large")
        }
        QuestionnaireError()
      }
      QuestionnaireItem(name: "company", required: true) {
        QuestionnaireTitle("What is your company called?")
        QuestionnaireInput("Acme Inc.")
        QuestionnaireError("Enter a company name to continue.")
      }
      QuestionnaireActions {
        QuestionnairePrevious()
        QuestionnaireSkip()
        QuestionnaireNext()
        QuestionnaireSubmit()
      }
    }
  }
}

private struct FeaturesQuestionnaire: View {
  let controller: QuestionnaireController

  var body: some View {
    Questionnaire(controller: controller) {
      QuestionnaireProgress()
      QuestionnaireItem(name: "features", required: true, multiple: true) {
        QuestionnaireTitle("Which features do you plan to use?")
        QuestionnaireDescription("Select all that apply.")
        QuestionnaireChoices {
          QuestionnaireChoice("Analytics", value: "analytics")
          QuestionnaireChoice("Billing", value: "billing")
          QuestionnaireChoice("Automations", value: "automations")
          QuestionnaireChoice("Integrations", value: "integrations", disabled: true)
        }
        QuestionnaireError("Choose at least one feature.")
      }
      QuestionnaireActions {
        QuestionnairePrevious()
        QuestionnaireSkip()
        QuestionnaireNext()
        QuestionnaireSubmit()
      }
    }
  }
}

private struct PlanQuestionnaire: View {
  let controller: QuestionnaireController

  var body: some View {
    Questionnaire(controller: controller) {
      QuestionnaireProgress()
      QuestionnaireItem(name: "plan", required: true) {
        QuestionnaireTitle("Which plan fits you best?")
        QuestionnaireChoices {
          QuestionnaireChoice(value: "starter") {
            Text("Starter")
            QuestionnaireChoiceDescription("For individuals trying things out.")
          }
          QuestionnaireChoice(value: "team") {
            Text("Team")
            QuestionnaireChoiceDescription("Shared workspaces and roles for growing teams.")
          }
          QuestionnaireChoice(value: "enterprise") {
            Text("Enterprise")
            QuestionnaireChoiceDescription("Single sign-on, audit logs, and priority support.")
          }
        }
        QuestionnaireError()
      }
      QuestionnaireActions {
        QuestionnairePrevious()
        QuestionnaireSkip()
        QuestionnaireNext()
        QuestionnaireSubmit()
      }
    }
  }
}

private struct QuestionnaireGallery: View {
  let midFlow: QuestionnaireController
  let blocked: QuestionnaireController
  let features: QuestionnaireController
  let plan: QuestionnaireController

  var body: some View {
    VStack(alignment: .leading, spacing: 32) {
      GallerySection("Mid-flow · question 2 of 3 · optional") {
        OnboardingQuestionnaire(controller: midFlow)
      }
      GallerySection("Required · Next without an answer") {
        OnboardingQuestionnaire(controller: blocked)
      }
      GallerySection("Multiple · default and disabled choice") {
        FeaturesQuestionnaire(controller: features)
      }
      GallerySection("Choice descriptions · single question") {
        PlanQuestionnaire(controller: plan)
      }
    }
  }
}

private struct EmailQuestionnaire: View {
  let controller: QuestionnaireController

  var body: some View {
    Questionnaire(controller: controller) {
      QuestionnaireProgress()
      QuestionnaireItem(name: "email", required: true) {
        QuestionnaireTitle("Where should we send your results?")
        QuestionnaireDescription("We only use your email to share the report.")
        QuestionnaireInput("you@example.com", keyboard: .emailAddress, contentType: .emailAddress)
        QuestionnaireError("Enter an email address to continue.")
      }
      QuestionnaireActions {
        QuestionnairePrevious()
        QuestionnaireSkip()
        QuestionnaireNext()
        QuestionnaireSubmit()
      }
    }
  }
}

private struct QuestionnaireInputGallery: View {
  let empty: QuestionnaireController
  let filled: QuestionnaireController
  let company: QuestionnaireController

  var body: some View {
    VStack(alignment: .leading, spacing: 32) {
      GallerySection("Text input · Submit without an answer") {
        EmailQuestionnaire(controller: empty)
      }
      GallerySection("Text input · filled") {
        EmailQuestionnaire(controller: filled)
      }
      GallerySection("Last question · registered items") {
        OnboardingQuestionnaire(controller: company)
      }
    }
    .padding(16)
  }
}

private struct ThemeSample: View {
  @Environment(\.theme) private var theme

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      ThemeToggle()
      HStack(spacing: 12) {
        Avatar(url: nil, initials: theme.resolvedTheme == .dark ? "D" : "L")
        VStack(alignment: .leading, spacing: 2) {
          Text(verbatim: "theme: \(theme.theme.rawValue)")
            .font(TextStyle.sm.font(weight: .semibold))
            .foregroundStyle(EsuissColor.foreground)
          Text(verbatim: "resolvedTheme: \(theme.resolvedTheme == .dark ? "dark" : "light")")
            .font(TextStyle.sm.font())
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        Spacer(minLength: 0)
        ThemeToggle(showsLabels: false)
      }
    }
    .padding(16)
    .background(EsuissColor.background, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
    .overlay {
      RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous).strokeBorder(EsuissColor.border)
    }
  }
}

private struct ThemeGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 28) {
      ForEach(Theme.allCases, id: \.self) { theme in
        GallerySection("ThemeProvider · \(theme.rawValue)") {
          ThemeProvider(defaultTheme: theme, storage: InMemoryThemeStorage()) {
            ThemeSample()
          }
        }
      }
    }
  }
}

private struct WeatherWidget: View {
  let size: WidgetSize?
  var align: WidgetAlign = .start

  var body: some View {
    Widget(size, align: align) {
      WeatherContent()
    }
  }
}

private struct WeatherContent: View {
  @Environment(\.widgetSize) private var size

  var body: some View {
    WidgetHeader {
      WidgetIcon {
        Ph.sun.fill.foregroundStyle(Color.adaptive(light: Palette.amber600, dark: Palette.amber400))
      }
      WidgetTitle(verbatim: "Istanbul")
      WidgetAction {
        Ph.dotsThree.bold.frame(width: 18, height: 18).foregroundStyle(EsuissColor.mutedForeground)
      }
    }
    WidgetContent {
      WidgetValue(verbatim: "24°")
      WidgetDescription(verbatim: "Partly cloudy")
    }
    if size == .large || size == .extraLarge {
      HStack(spacing: 0) {
        ForEach(Array(["Now", "13", "14", "15", "16"].enumerated()), id: \.offset) { index, hour in
          VStack(spacing: 6) {
            Text(verbatim: hour).font(TextStyle.xs.font()).foregroundStyle(EsuissColor.mutedForeground)
            (index % 2 == 0 ? Ph.sun.fill : Ph.cloudSun.fill)
              .frame(width: 18, height: 18)
              .foregroundStyle(index % 2 == 0 ? Color.adaptive(light: Palette.amber600, dark: Palette.amber400) : EsuissColor.mutedForeground)
            Text(verbatim: "\(24 + index % 3)°").font(TextStyle.sm.font(weight: .semibold))
          }
          .frame(maxWidth: .infinity)
        }
      }
    }
    WidgetFooter(verbatim: "H 27° · L 18°")
  }
}

private struct SalesContent: View {
  @Environment(\.widgetSize) private var size

  private let hourly: [CGFloat] = [12, 18, 14, 30, 44, 34, 22, 40, 100, 46, 30, 14]

  var body: some View {
    WidgetHeader {
      WidgetIcon(size: .sm) {
        Ph.cashRegister.fill.foregroundStyle(Color.adaptive(light: Palette.amber600, dark: Palette.amber400))
      }
      WidgetTitle(verbatim: "Hestia").foregroundStyle(Color.adaptive(light: Palette.amber600, dark: Palette.amber400))
    }
    WidgetContent {
      WidgetValue(verbatim: "₺18,240")
      Text(verbatim: "Today's revenue · 42 orders")
        .font(TextStyle.xs.font())
        .foregroundStyle(EsuissColor.mutedForeground)
    }
    if size != .small {
      HStack(alignment: .bottom, spacing: 4) {
        ForEach(Array(hourly.enumerated()), id: \.offset) { _, value in
          RoundedRectangle(cornerRadius: Radius.sm)
            .fill(value == 100 ? Palette.amber500 : EsuissColor.secondary)
            .frame(height: (size == .medium ? 32 : 56) * value / 100)
        }
      }
      .frame(height: size == .medium ? 32 : 56, alignment: .bottom)
    }
  }
}

private struct EditingWidget: View {
  @State var size: WidgetSize

  var body: some View {
    Widget(size: $size, editing: true, resetSize: .large) {
      SalesContent()
    }
  }
}

private struct WidgetGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 28) {
      GallerySection("Small · start and center") {
        HStack(spacing: 16) {
          WeatherWidget(size: .small)
          WeatherWidget(size: .small, align: .center)
        }
      }
      GallerySection("Medium") {
        WeatherWidget(size: .medium)
      }
      GallerySection("Large") {
        WeatherWidget(size: .large)
      }
      GallerySection("Auto") {
        WeatherWidget(size: nil).frame(height: 150)
      }
      GallerySection("Editing · handle outside") {
        EditingWidget(size: .medium)
      }
      GallerySection("Editing · dragging toward small") {
        Widget(size: .large, editing: true, handle: .inside, preview: (.small, CGSize(width: 214, height: 230))) {
          SalesContent()
        }
      }
    }
  }
}

private struct WideWidgetGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Caption(text: "Extra large")
      WeatherWidget(size: .extraLarge)
    }
  }
}

private struct IslandRingGallery: View {
  var body: some View {
    HStack(spacing: 16) {
      IslandRing(value: 0)
      IslandRing(value: 0.42)
      IslandRing(value: 1)
      IslandRing(value: 0.62, color: Palette.green500)
    }
    .padding(12)
    .background(Palette.black, in: Capsule())
  }
}

private struct CameraPlaceholder: View {
  var body: some View {
    ZStack {
      LinearGradient(colors: [EsuissColor.mutedForeground, EsuissColor.mutedForeground], startPoint: .topLeading, endPoint: .bottomTrailing)
      RoundedRectangle(cornerRadius: Radius.lg)
        .fill(EsuissColor.secondary)
        .frame(width: 150, height: 150)
        .overlay {
          Ph.qrCode.regular.frame(width: 120, height: 120).foregroundStyle(EsuissColor.mutedForeground)
        }
        .rotationEffect(.degrees(-6))
    }
    .environment(\.colorScheme, .light)
  }
}

private struct QRScannerGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 24) {
      GallerySection("Idle · scan line · flashlight") {
        QRScanner(title: "Scan QR code", hint: "Point the camera at a code to pay.", scanLine: true, onTorchToggle: {}) {
          CameraPlaceholder()
        }
        .frame(height: 520)
        .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
      }
      GallerySection("Success · flashlight on") {
        QRScanner(state: .success, title: "Code found", hint: "Opening payment…", isTorchOn: true, onTorchToggle: {}) {
          CameraPlaceholder()
        }
        .frame(height: 520)
        .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
      }
      GallerySection("Error") {
        QRScanner(state: .error, title: "Unsupported code", hint: "Try a payment QR code instead.") {
          CameraPlaceholder()
        }
        .frame(height: 520)
        .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
      }
    }
  }
}

private func signatureStrokes(width: CGFloat = 360, height: CGFloat = 200) -> [SignatureStroke] {
  let baseline = height - 44
  var first: [CGPoint] = []
  for step in 0...80 {
    let t = CGFloat(step) / 80
    let x = 36 + t * 170
    let y = baseline - 40 - sin(t * .pi * 3.2) * 34 * (1 - t * 0.4) + t * 22
    first.append(CGPoint(x: x, y: y))
  }
  var loop: [CGPoint] = []
  for step in 0...60 {
    let t = CGFloat(step) / 60 * .pi * 2
    loop.append(CGPoint(x: 230 + cos(t) * 18 + CGFloat(step) * 0.9, y: baseline - 30 + sin(t) * 22))
  }
  var tail: [CGPoint] = []
  for step in 0...30 {
    let t = CGFloat(step) / 30
    tail.append(CGPoint(x: 290 + t * 50, y: baseline - 24 - t * 30 + sin(t * .pi) * 10))
  }
  return [SignatureStroke(first), SignatureStroke(loop), SignatureStroke(tail), SignatureStroke([CGPoint(x: 352, y: baseline - 70)])]
}

private struct SignatureSample: View {
  @State var strokes: [SignatureStroke]

  var body: some View {
    SignaturePad(value: $strokes)
      .frame(height: 200)
  }
}

private struct SignatureGallery: View {
  @Environment(\.colorScheme) private var colorScheme

  var body: some View {
    VStack(alignment: .leading, spacing: 28) {
      GallerySection("Empty") {
        SignatureSample(strokes: [])
      }
      GallerySection("Signed") {
        SignatureSample(strokes: signatureStrokes())
      }
      GallerySection("Invalid") {
        SignatureSample(strokes: []).invalid()
      }
      GallerySection("Disabled") {
        SignatureSample(strokes: signatureStrokes()).disabled(true)
      }
      GallerySection("Exported image") {
        if let image = SignaturePad.image(signatureStrokes(), size: CGSize(width: 370, height: 200), colorScheme: colorScheme) {
          Image(uiImage: image)
            .resizable()
            .scaledToFit()
            .frame(height: 100)
            .padding(8)
            .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.lg))
        }
      }
    }
  }
}

private struct Profile: Identifiable {
  let id: Int
  let name: String
  let detail: String
}

private let profiles = [
  Profile(id: 0, name: "Lisbon", detail: "4 nights · from ₺9,400"),
  Profile(id: 1, name: "Kyoto", detail: "6 nights · from ₺21,800"),
  Profile(id: 2, name: "Cape Town", detail: "5 nights · from ₺17,200"),
  Profile(id: 3, name: "Reykjavík", detail: "3 nights · from ₺12,600"),
]

private struct ProfileCard: View {
  let profile: Profile

  var body: some View {
    let palettes: [(Color, Color)] = [(EsuissColor.primary, Palette.green500), (Palette.amber500, EsuissColor.destructive), (Palette.green500, EsuissColor.primary), (EsuissColor.destructive, Palette.amber500)]
    let pair = palettes[profile.id % palettes.count]
    ZStack(alignment: .bottomLeading) {
      LinearGradient(colors: [pair.0, pair.1], startPoint: .topLeading, endPoint: .bottomTrailing)
      VStack(alignment: .leading, spacing: 4) {
        Text(verbatim: profile.name)
          .font(TextStyle.xl2.font(weight: .bold))
        Text(verbatim: profile.detail)
          .font(TextStyle.sm.font())
          .opacity(0.85)
      }
      .foregroundStyle(EsuissColor.primaryForeground)
      .padding(20)
    }
    .clipShape(RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous))
    .overlay {
      RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous).strokeBorder(EsuissColor.foreground.opacity(0.08))
    }
    .shadow(.md)
  }
}

private struct CardStackGallery: View {
  let resting: CardStackController
  let swiping: CardStackController

  var body: some View {
    VStack(alignment: .leading, spacing: 28) {
      GallerySection("Three cards") {
        VStack(spacing: 20) {
          CardStack(Array(profiles.prefix(3)), controller: resting) { profile in
            ProfileCard(profile: profile)
          }
          .frame(height: 320)
          HStack(spacing: 20) {
            CardStackButton(.undo, controller: resting)
            CardStackButton(.swipeLeft, controller: resting)
            CardStackButton(.swipeRight, controller: resting)
          }
        }
      }
      GallerySection("Mid-swipe right") {
        CardStack(profiles, controller: swiping, drag: CGSize(width: 110, height: 14)) { profile in
          ProfileCard(profile: profile)
        }
        .frame(height: 320)
      }
    }
    .padding(16)
  }
}

@MainActor
private final class ThemeBox {
  var values: [Theme] = []
}

@MainActor
final class ExtrasGalleryTests: XCTestCase {
  private var output: String {
    ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
  }

  private func render<V: View>(_ view: V, name: String, padding: CGFloat = 16, width: CGFloat = 402) throws {
    for scheme in [ColorScheme.light, .dark] {
      let renderer = ImageRenderer(content: view
        .padding(padding)
        .frame(width: width, alignment: .leading)
        .background(EsuissColor.background)
        .environment(\.colorScheme, scheme)
        .environment(\.locale, Locale(identifier: "en_US")))
      renderer.scale = 3
      let data = try XCTUnwrap(renderer.uiImage?.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  private func snapshot<V: View>(
    _ view: @autoclosure () -> V,
    name: String,
    width: CGFloat = 402,
    wait: TimeInterval = 0.8
  ) throws {
    for scheme in [ColorScheme.light, .dark] {
      let host = UIHostingController(rootView: view()
        .frame(width: width, alignment: .leading)
        .background(EsuissColor.background)
        .environment(\.locale, Locale(identifier: "en_US")))
      host.safeAreaRegions = []
      let initial = host.sizeThatFits(in: CGSize(width: width, height: CGFloat.greatestFiniteMagnitude))
      let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
      let window = scene.map { UIWindow(windowScene: $0) } ?? UIWindow()
      window.frame = CGRect(origin: .zero, size: initial)
      window.overrideUserInterfaceStyle = scheme == .dark ? .dark : .light
      window.rootViewController = host
      window.makeKeyAndVisible()
      host.view.frame = window.bounds
      host.view.layoutIfNeeded()
      RunLoop.main.run(until: Date().addingTimeInterval(wait))
      let size = host.sizeThatFits(in: CGSize(width: width, height: CGFloat.greatestFiniteMagnitude))
      window.frame = CGRect(origin: .zero, size: size)
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

  private func midFlowController() -> QuestionnaireController {
    let controller = QuestionnaireController(items: onboardingItems)
    controller.select("design", in: "role")
    controller.goNext()
    controller.select("small", in: "team-size")
    return controller
  }

  private func blockedController() -> QuestionnaireController {
    let controller = QuestionnaireController(items: onboardingItems)
    controller.goNext()
    return controller
  }

  func testRendersQuestionnaireGallery() throws {
    let features = QuestionnaireController(
      items: [QuestionnaireItemDefinition("features", required: true, multiple: true)],
      defaultValues: ["features": ["analytics"]]
    )
    features.toggle("billing", in: "features")
    let plan = QuestionnaireController(
      items: [QuestionnaireItemDefinition("plan", required: true)],
      defaultValues: ["plan": ["team"]]
    )
    try render(
      QuestionnaireGallery(midFlow: midFlowController(), blocked: blockedController(), features: features, plan: plan),
      name: "extras-questionnaire"
    )
  }

  func testRendersQuestionnaireInputGallery() throws {
    try snapshot(
      {
        let empty = QuestionnaireController(items: [QuestionnaireItemDefinition("email", required: true)])
        empty.submit()
        let filled = QuestionnaireController(items: [QuestionnaireItemDefinition("email", required: true)])
        filled.setText("jordan@example.com", for: "email")
        let company = QuestionnaireController(defaultItem: "company")
        return QuestionnaireInputGallery(empty: empty, filled: filled, company: company)
      }(),
      name: "extras-questionnaire-input"
    )
  }

  func testRendersThemeGallery() throws {
    try render(ThemeGallery(), name: "extras-theme")
  }

  func testRendersWidgetGallery() throws {
    try render(WidgetGallery(), name: "extras-widget")
    try render(WideWidgetGallery(), name: "extras-widget-wide", width: 760)
  }

  func testRendersIslandRingGallery() throws {
    try render(IslandRingGallery(), name: "extras-island-ring")
  }

  func testRendersQRScannerGallery() throws {
    try render(QRScannerGallery(), name: "extras-qr-scanner")
  }

  func testRendersSignatureGallery() throws {
    try render(SignatureGallery(), name: "extras-signature-pad")
  }

  func testRendersCardStackGallery() throws {
    try snapshot(CardStackGallery(resting: CardStackController(), swiping: CardStackController()), name: "extras-card-stack")
  }

  func testQuestionnaireNavigationAndValidation() {
    var changes: [String] = []
    let controller = QuestionnaireController(items: onboardingItems)
    controller.onItemChange = { changes.append($0) }
    XCTAssertEqual(controller.activeItem, "role")
    XCTAssertEqual(controller.current, 1)
    XCTAssertEqual(controller.total, 3)
    XCTAssertTrue(controller.isFirst)
    XCTAssertEqual(controller.activeItemRequired, true)
    XCTAssertFalse(controller.isInvalid("role"))
    XCTAssertFalse(controller.goNext())
    XCTAssertTrue(controller.isInvalid("role"))
    XCTAssertEqual(controller.activeItem, "role")
    controller.select("design", in: "role")
    XCTAssertFalse(controller.isInvalid("role"))
    XCTAssertEqual(controller.status(of: "role"), .answered)
    controller.select("product", in: "role")
    XCTAssertEqual(controller.values["role"], ["product"])
    XCTAssertTrue(controller.goNext())
    XCTAssertEqual(controller.activeItem, "team-size")
    XCTAssertEqual(controller.direction, .forward)
    XCTAssertEqual(controller.activeItemRequired, false)
    XCTAssertTrue(controller.skip())
    XCTAssertEqual(controller.status(of: "team-size"), .skipped)
    XCTAssertEqual(controller.activeItem, "company")
    XCTAssertTrue(controller.isLast)
    XCTAssertFalse(controller.skip())
    controller.goPrevious()
    XCTAssertEqual(controller.activeItem, "team-size")
    XCTAssertEqual(controller.direction, .backward)
    XCTAssertEqual(changes, ["team-size", "company", "team-size"])
    controller.toggle("small", in: "team-size")
    XCTAssertEqual(controller.status(of: "team-size"), .answered)
    controller.go(to: "missing")
    XCTAssertEqual(controller.activeItem, "team-size")
  }

  func testQuestionnaireSubmitJumpsToFirstInvalidAndResets() {
    var submitted: [String: [String]]?
    let controller = QuestionnaireController(
      items: onboardingItems + [QuestionnaireItemDefinition("hidden", required: true, disabled: true)],
      defaultItem: "company",
      defaultValues: ["role": ["design"]]
    )
    controller.onSubmit = { submitted = $0 }
    XCTAssertEqual(controller.activeItem, "company")
    XCTAssertEqual(controller.total, 3)
    XCTAssertFalse(controller.submit())
    XCTAssertEqual(controller.activeItem, "team-size")
    XCTAssertTrue(controller.isInvalid("team-size"))
    XCTAssertFalse(controller.isInvalid("role"))
    XCTAssertTrue(controller.skip())
    XCTAssertFalse(controller.isInvalid("team-size"))
    XCTAssertEqual(controller.activeItem, "company")
    controller.setText("   ", for: "company")
    XCTAssertFalse(controller.advance())
    XCTAssertEqual(controller.activeItem, "company")
    XCTAssertTrue(controller.isInvalid("company"))
    controller.setText("Acme", for: "company")
    XCTAssertTrue(controller.advance())
    XCTAssertEqual(submitted, ["role": ["design"], "company": ["Acme"]])
    controller.go(to: "role")
    controller.select("design", in: "role", selected: false)
    XCTAssertFalse(controller.submit())
    XCTAssertEqual(controller.activeItem, "role")
    controller.reset()
    XCTAssertEqual(controller.activeItem, "company")
    XCTAssertEqual(controller.values, ["role": ["design"]])
    XCTAssertFalse(controller.isInvalid("role"))
  }

  func testQuestionnaireMultipleAndRegisteredItems() {
    let controller = QuestionnaireController(defaultItem: "b")
    XCTAssertNil(controller.activeItem)
    XCTAssertEqual(controller.current, 0)
    controller.register([
      QuestionnaireItemDefinition("a", required: true, multiple: true),
      QuestionnaireItemDefinition("b"),
      QuestionnaireItemDefinition("a"),
    ])
    XCTAssertEqual(controller.sequence, ["a", "b"])
    XCTAssertEqual(controller.activeItem, "b")
    controller.go(to: "a")
    controller.toggle("x", in: "a")
    controller.toggle("y", in: "a")
    XCTAssertEqual(controller.values["a"], ["x", "y"])
    controller.toggle("x", in: "a")
    XCTAssertEqual(controller.values["a"], ["y"])
    XCTAssertTrue(controller.isSelected("y", in: "a"))
    XCTAssertFalse(controller.skip())
    let invalid = QuestionnaireController(items: [QuestionnaireItemDefinition("z", invalid: true)])
    invalid.select("v", in: "z")
    XCTAssertTrue(invalid.isInvalid("z"))
    XCTAssertFalse(invalid.submit())
    XCTAssertTrue(invalid.skip())
    XCTAssertEqual(invalid.status(of: "z"), .skipped)
  }

  func testThemeResolutionAndStorage() async {
    XCTAssertEqual(ThemeMath.resolve(.light, system: .dark), .light)
    XCTAssertEqual(ThemeMath.resolve(.dark, system: .light), .dark)
    XCTAssertEqual(ThemeMath.resolve(.system, system: .dark), .dark)
    XCTAssertEqual(ThemeMath.resolve(.system, system: .light), .light)
    XCTAssertEqual(ThemeMath.parse("dark", fallback: .system), .dark)
    XCTAssertEqual(ThemeMath.parse("sepia", fallback: .light), .light)
    XCTAssertEqual(ThemeMath.parse(nil, fallback: .system), .system)
    XCTAssertNil(Theme.system.colorScheme)
    let storage = InMemoryThemeStorage()
    await storage.setItem("theme", Theme.dark.rawValue)
    let stored = await storage.getItem("theme")
    XCTAssertEqual(ThemeMath.parse(stored, fallback: .light), .dark)
    let box = ThemeBox()
    let context = ThemeContext(theme: .light, resolvedTheme: .light) { box.values.append($0) }
    context.setTheme(.system)
    XCTAssertEqual(box.values, [.system])
  }

  func testWidgetSizeSnapping() {
    let all = WidgetSize.allCases
    XCTAssertEqual(WidgetMath.nearest(width: 170, height: 160, sizes: all), .small)
    XCTAssertEqual(WidgetMath.nearest(width: 300, height: 200, sizes: all), .medium)
    XCTAssertEqual(WidgetMath.nearest(width: 340, height: 300, sizes: all), .large)
    XCTAssertEqual(WidgetMath.nearest(width: 700, height: 300, sizes: all), .extraLarge)
    XCTAssertNil(WidgetMath.nearest(width: 10, height: 10, sizes: []))
    XCTAssertEqual(WidgetMath.fitting(all, room: 370), [.small, .medium, .large])
    XCTAssertEqual(WidgetMath.fitting(all, room: 100), [.small])
    XCTAssertEqual(WidgetMath.fitting([.large, .medium], room: 100), [.large])
    let start = WidgetSize.large.dimensions
    XCTAssertEqual(WidgetMath.target(start: start, translation: CGSize(width: -184, height: -184), room: 370, sizes: all), .small)
    XCTAssertEqual(WidgetMath.target(start: start, translation: CGSize(width: 0, height: -150), room: 370, sizes: all), .medium)
    XCTAssertEqual(WidgetMath.target(start: start, translation: CGSize(width: 400, height: 0), room: 370, sizes: all), .large)
    XCTAssertEqual(WidgetMath.target(start: start, translation: CGSize(width: 400, height: 0), room: 800, sizes: all), .extraLarge)
    let frame = WidgetMath.frame(start: start, translation: CGSize(width: 500, height: 500), room: 370, sizes: all)
    XCTAssertEqual(frame.width, 370)
    XCTAssertEqual(frame.height, 400)
    let small = WidgetMath.frame(start: start, translation: CGSize(width: -500, height: -500), room: 370, sizes: all)
    XCTAssertEqual(small, WidgetSize.small.dimensions)
  }

  func testIslandRingClampsProgress() {
    XCTAssertEqual(IslandMath.ringProgress(1.4), 1)
    XCTAssertEqual(IslandMath.ringProgress(-1), 0)
    XCTAssertEqual(IslandMath.ringProgress(0.5), 0.5)
  }

  func testCardStackSwipeThresholds() {
    XCTAssertEqual(CardStackMath.threshold(width: 360), 108)
    XCTAssertEqual(CardStackMath.threshold(width: 800), 120)
    XCTAssertEqual(CardStackMath.direction(translation: 120, predicted: 140, width: 360), .right)
    XCTAssertEqual(CardStackMath.direction(translation: -110, predicted: -110, width: 360), .left)
    XCTAssertNil(CardStackMath.direction(translation: 60, predicted: 120, width: 360))
    XCTAssertEqual(CardStackMath.direction(translation: 40, predicted: 260, width: 360), .right)
    XCTAssertNil(CardStackMath.direction(translation: -10, predicted: 260, width: 360))
    XCTAssertEqual(CardStackMath.rotation(translation: 1000, width: 360), 12)
    XCTAssertEqual(CardStackMath.rotation(translation: -1000, width: 360), -12)
    XCTAssertEqual(CardStackMath.rotation(translation: 0, width: 0), 0)
    XCTAssertEqual(CardStackMath.progress(translation: -54, width: 360), 0.5, accuracy: 0.001)
    XCTAssertEqual(CardStackMath.scale(depth: 1, progress: 0), 0.95, accuracy: 0.001)
    XCTAssertEqual(CardStackMath.scale(depth: 1, progress: 1), 1, accuracy: 0.001)
    XCTAssertEqual(CardStackMath.offset(depth: 2, progress: 0.5), 18, accuracy: 0.001)
    XCTAssertGreaterThan(CardStackMath.exit(direction: .right, width: 360), 360)
    XCTAssertLessThan(CardStackMath.exit(direction: .left, width: 360), -360)

    let controller = CardStackController()
    controller.count = 2
    XCTAssertFalse(controller.canUndo)
    controller.swipe(.left)
    XCTAssertEqual(controller.pending, .left)
    controller.swipe(.right)
    XCTAssertEqual(controller.pending, .left)
    controller.commit(.left)
    XCTAssertEqual(controller.index, 1)
    XCTAssertNil(controller.pending)
    controller.commit(.right)
    XCTAssertEqual(controller.index, 2)
    XCTAssertFalse(controller.canSwipe)
    controller.swipe(.left)
    XCTAssertNil(controller.pending)
    controller.undo()
    XCTAssertEqual(controller.index, 1)
    XCTAssertEqual(controller.restoring, .right)
    XCTAssertEqual(controller.history, [.left])
    controller.reset()
    XCTAssertEqual(controller.index, 0)
    XCTAssertFalse(controller.canUndo)
  }

  func testSignaturePathBuilding() {
    XCTAssertTrue(SignatureMath.path(for: [CGPoint](), strokeWidth: 2).isEmpty)
    let dot = SignatureMath.path(for: [CGPoint(x: 10, y: 10)], strokeWidth: 4).boundingRect
    XCTAssertEqual(dot, CGRect(x: 8, y: 8, width: 4, height: 4))
    let line = SignatureMath.path(for: [CGPoint(x: 0, y: 0), CGPoint(x: 20, y: 10)], strokeWidth: 2).boundingRect
    XCTAssertEqual(line, CGRect(x: 0, y: 0, width: 20, height: 10))
    let points = (0...10).map { CGPoint(x: CGFloat($0) * 10, y: $0 % 2 == 0 ? 0 : 20) }
    let curve = SignatureMath.path(for: points, strokeWidth: 2).boundingRect
    XCTAssertEqual(curve.minX, 0, accuracy: 0.001)
    XCTAssertEqual(curve.maxX, 100, accuracy: 0.001)
    XCTAssertGreaterThan(curve.height, 0)
    XCTAssertLessThanOrEqual(curve.maxY, 20)
    let combined = SignaturePad.path([SignatureStroke(points), SignatureStroke([CGPoint(x: 200, y: 50)])], strokeWidth: 2).boundingRect
    XCTAssertEqual(combined.maxX, 201, accuracy: 0.001)
    XCTAssertEqual(SignatureMath.appending(CGPoint(x: 1, y: 0), to: [.zero]), [.zero])
    XCTAssertEqual(SignatureMath.appending(CGPoint(x: 3, y: 0), to: [.zero]).count, 2)
    XCTAssertEqual(SignatureMath.appending(.zero, to: []), [.zero])
    XCTAssertEqual(SignatureMath.clamp(CGPoint(x: -5, y: 500), to: CGSize(width: 100, height: 100)), CGPoint(x: 0, y: 100))
    let image = SignaturePad.image(signatureStrokes(), size: CGSize(width: 360, height: 200), scale: 1)
    XCTAssertEqual(image?.size, CGSize(width: 360, height: 200))
  }

  func testQRScannerFrameFitsTheViewport() {
    let frame = QRScannerMath.frame(in: CGSize(width: 402, height: 874))
    XCTAssertEqual(frame.width, 260)
    XCTAssertEqual(frame.midX, 201)
    XCTAssertEqual(frame.minY, 283)
    let small = QRScannerMath.frame(in: CGSize(width: 300, height: 300))
    XCTAssertEqual(small.width, 198, accuracy: 0.001)
    XCTAssertEqual(small.minY, 27, accuracy: 0.001)
    let fixed = QRScannerMath.frame(in: CGSize(width: 402, height: 874), frameSize: 200)
    XCTAssertEqual(fixed.width, 200)
    let brackets = QRScannerMath.brackets(side: 200).boundingRect
    XCTAssertEqual(brackets.minX, 0, accuracy: 0.001)
    XCTAssertEqual(brackets.maxX, 200, accuracy: 0.001)
    XCTAssertEqual(brackets.maxY, 200, accuracy: 0.001)
  }
}
