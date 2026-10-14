import PhosphorSwift
import SwiftUI
import XCTest

@testable import EsuissUI

private let phone = CGSize(width: 402, height: 874)

private struct Shot {
  let caption: String
  let height: CGFloat
  let view: AnyView

  init<V: View>(_ caption: String, height: CGFloat = phone.height, @ViewBuilder view: () -> V) {
    self.caption = caption
    self.height = height
    self.view = AnyView(view())
  }
}

private struct Board: View {
  let shots: [Shot]

  var body: some View {
    HStack(alignment: .top, spacing: 24) {
      ForEach(Array(shots.enumerated()), id: \.offset) { _, shot in
        VStack(alignment: .leading, spacing: 10) {
          Text(verbatim: shot.caption)
            .font(TextStyle.xs.font(weight: .semibold))
            .foregroundStyle(Color.labelSecondary)
          shot.view
            .frame(width: phone.width, height: shot.height)
            .clipShape(RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous))
            .overlay {
              RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous).strokeBorder(Color.separator)
            }
        }
      }
    }
    .padding(24)
    .fixedSize()
    .background(Color.surface)
  }
}

private struct Presented<Base: View, Content: View>: View {
  let alignment: Alignment
  let base: Base
  let content: Content

  init(alignment: Alignment, @ViewBuilder base: () -> Base, @ViewBuilder content: () -> Content) {
    self.alignment = alignment
    self.base = base()
    self.content = content()
  }

  var body: some View {
    ZStack(alignment: alignment) {
      base
      Color.scrim
      content
    }
  }
}

@MainActor
final class BlocksGalleryTests: XCTestCase {
  private func snapshot(_ shots: [Shot], name: String) throws {
    let output = ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
    let width = CGFloat(shots.count) * phone.width + CGFloat(shots.count - 1) * 24 + 48
    let height = (shots.map(\.height).max() ?? phone.height) + 48 + 28
    let size = CGSize(width: width, height: height)
    for scheme in [ColorScheme.light, .dark] {
      let host = UIHostingController(rootView: Board(shots: shots)
        .frame(width: size.width, height: size.height, alignment: .topLeading)
        .background(Color.surface)
        .environment(\.locale, Locale(identifier: "en_US")))
      host.safeAreaRegions = []
      let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
      let window = scene.map { UIWindow(windowScene: $0) } ?? UIWindow()
      window.frame = CGRect(origin: .zero, size: size)
      window.overrideUserInterfaceStyle = scheme == .dark ? .dark : .light
      window.rootViewController = host
      window.makeKeyAndVisible()
      host.view.frame = window.bounds
      host.view.layoutIfNeeded()
      RunLoop.main.run(until: Date().addingTimeInterval(2))
      host.view.layoutIfNeeded()
      let format = UIGraphicsImageRendererFormat()
      format.scale = 2
      let image = UIGraphicsImageRenderer(size: size, format: format).image {
        host.view.layer.render(in: $0.cgContext)
      }
      window.isHidden = true
      let data = try XCTUnwrap(image.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  func testRendersLoginAccount() throws {
    try snapshot([
      Shot("Email") { LoginAccount() },
      Shot("Password step") { LoginAccount(step: .password, email: "jamie@suiss.com", password: "secret") },
      Shot("Invalid") { LoginAccount(step: .email, email: "jamie", error: "Enter a valid suiss Account.") },
      Shot("Signed in") { LoginAccount(step: .password, email: "jamie@suiss.com", signedIn: true) },
    ], name: "blocks-login-account")
  }

  func testRendersLoginPasskey() throws {
    try snapshot([
      Shot("Default") { LoginPasskey() },
      Shot("Face scan") {
        Presented(alignment: .center) { LoginPasskey() } content: {
          LoginPasskeyScan(verified: false, onCancel: {})
        }
      },
      Shot("Verified") {
        Presented(alignment: .center) { LoginPasskey() } content: {
          LoginPasskeyScan(verified: true, onCancel: {})
        }
      },
      Shot("Signed in") { LoginPasskey(status: .done) },
    ], name: "blocks-login-passkey")
  }

  func testRendersLoginSheet() throws {
    try snapshot([
      Shot("Default") { LoginSheet() },
      Shot("Sheet") {
        Presented(alignment: .bottom) { LoginSheet() } content: {
          LoginSheetPanel(onComplete: {})
            .padding(.bottom, 20)
            .background(Color.surfaceRaised)
            .clipShape(UnevenRoundedRectangle(topLeadingRadius: Radius.xl3, topTrailingRadius: Radius.xl3, style: .continuous))
        }
      },
      Shot("Signed in") { LoginSheet(open: false, done: true) },
    ], name: "blocks-login-sheet")
  }

  func testRendersSignupForm() throws {
    var filled = SignupForm.Values()
    filled.first = "Jamie"
    filled.last = "Rivera"
    filled.birthday = "04/12/1994"
    filled.email = "jamie@suiss.com"
    filled.password = "Trail2024"
    filled.confirm = "Trail2025"
    var done = filled
    done.confirm = filled.password
    try snapshot([
      Shot("Default") { SignupForm() },
      Shot("Mismatch (full height)", height: 1180) { SignupForm(form: filled, tried: true) },
      Shot("Ready") { SignupForm(form: done, done: true) },
    ], name: "blocks-signup-form")
  }

  func testRendersSignupSteps() throws {
    try snapshot([
      Shot("Step 1") { SignupSteps() },
      Shot("Step 2") { SignupSteps(index: 1, values: ["Jamie Rivera", "jamie@suiss", ""]) },
      Shot("Step 3 rules") { SignupSteps(index: 2, values: ["Jamie Rivera", "jamie@suiss.com", "trail2024"]) },
      Shot("Done") { SignupSteps(index: 2, values: ["Jamie Rivera", "jamie@suiss.com", "Trail2024"], done: true) },
    ], name: "blocks-signup-steps")
  }

  func testRendersSignupTrial() throws {
    try snapshot([
      Shot("Default") { SignupTrial() },
      Shot("Filled") { SignupTrial(email: "jamie@suiss.com", password: "Trail2024", terms: true) },
      Shot("Weak") { SignupTrial(email: "jamie@suiss.com", password: "trail", terms: false) },
      Shot("Started") { SignupTrial(email: "jamie@suiss.com", password: "Trail2024", terms: true, done: true) },
    ], name: "blocks-signup-trial")
  }

  func testRendersVerifyCode() throws {
    try snapshot([
      Shot("Default") { VerifyCode() },
      Shot("Typing") { VerifyCode(code: "482", status: .idle, left: 12) },
      Shot("Incorrect") { VerifyCode(code: "123456", status: .error, left: 0) },
      Shot("Verified") { VerifyCode(code: "482913", status: .ok, left: 0) },
    ], name: "blocks-verify-code")
  }

  func testRendersVerifyDevice() throws {
    try snapshot([
      Shot("Request") { VerifyDevice() },
      Shot("Code") { VerifyDevice(phase: .code, code: "48") },
      Shot("Incorrect") { VerifyDevice(phase: .code, code: "111111", error: true) },
      Shot("Denied") { VerifyDevice(phase: .deny) },
      Shot("Approved") { VerifyDevice(phase: .ok) },
    ], name: "blocks-verify-device")
  }

  func testRendersVerifyEmail() throws {
    try snapshot([
      Shot("Default") { VerifyEmail() },
      Shot("Resent") { VerifyEmail(verified: false, left: 45) },
      Shot("Verified") { VerifyEmail(verified: true, left: 0) },
    ], name: "blocks-verify-email")
  }

  func testRendersSettingsAccount() throws {
    try snapshot([
      Shot("Sections") { SettingsAccount(section: nil) },
      Shot("Sign-In & Security") { SettingsAccount(section: "security") },
      Shot("Editing") { SettingsAccount(section: "security", editing: "email") },
      Shot("Other section") { SettingsAccount(section: "privacy") },
    ], name: "blocks-settings-account")
  }

  func testRendersSettingsDevice() throws {
    try snapshot([
      Shot("Default") { SettingsDevice() },
      Shot("Search") { SettingsDevice(query: "o") },
      Shot("No results") { SettingsDevice(query: "zzz") },
    ], name: "blocks-settings-device")
  }

  func testRendersSettingsNotifications() throws {
    try snapshot([
      Shot("Default") { SettingsNotifications() },
      Shot("Full height", height: 1340) { SettingsNotifications() },
      Shot("Off (full height)", height: 1340) { SettingsNotifications(allow: false) },
    ], name: "blocks-settings-notifications")
  }

  func testRendersEmptyBag() throws {
    try snapshot([
      Shot("Empty") { EmptyBag() },
      Shot("Two items") { EmptyBag(added: ["Pods Studio", "Sport Band"]) },
    ], name: "blocks-empty-bag")
  }

  func testRendersEmptyOffline() throws {
    try snapshot([
      Shot("Offline") { EmptyOffline() },
      Shot("Connecting") { EmptyOffline(state: .loading, connects: false) },
      Shot("Online") { EmptyOffline(state: .online) },
    ], name: "blocks-empty-offline")
  }

  func testRendersEmptySearch() throws {
    try snapshot([
      Shot("No results") { EmptySearch() },
      Shot("Suggestions") { EmptySearch(query: "book") },
      Shot("Idle") { EmptySearch(query: "") },
    ], name: "blocks-empty-search")
  }

  func testRendersOnboarding() throws {
    try snapshot([
      Shot("First page") { Onboarding(onDone: {}) },
      Shot("Last page") { Onboarding(pages: OnboardingPage.samples, index: 3, onDone: {}) },
    ], name: "blocks-onboarding")
  }

  func testRendersPermissionPrimer() throws {
    try snapshot([
      Shot("Notifications") { PermissionPrimer(onAllow: {}, onDismiss: {}) },
      Shot("Camera") {
        PermissionPrimer(
          icon: Ph.camera.duotone,
          title: "Allow camera access",
          description: "Scan cards and documents in seconds instead of typing them in.",
          benefits: [
            PermissionPrimerBenefit(icon: Ph.creditCard.regular, title: "Add cards", description: "Point at a card to fill in its number."),
            PermissionPrimerBenefit(icon: Ph.qrCode.regular, title: "Scan to pay", description: "Pay at the counter with a QR code."),
          ],
          onAllow: {},
          onDismiss: {}
        )
      },
    ], name: "blocks-permission-primer")
  }

  func testSignupStepsAdvanceAndFinish() {
    XCTAssertFalse(SignupSteps.steps[0].valid("J"))
    XCTAssertTrue(SignupSteps.steps[0].valid("Jamie"))
    XCTAssertFalse(SignupSteps.steps[1].valid("jamie@suiss"))
    XCTAssertTrue(SignupSteps.steps[1].valid("jamie@suiss.com"))
    XCTAssertFalse(SignupSteps.steps[2].valid("trail2024"))
    XCTAssertTrue(SignupSteps.steps[2].valid("Trail2024"))
  }
}
