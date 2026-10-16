import PhosphorSwift
import SwiftUI
import XCTest

@testable import EsuissUI

private let phone = CGSize(width: 402, height: 874)

private struct Shot {
  let caption: String
  let width: CGFloat
  let height: CGFloat
  let view: AnyView

  init<V: View>(_ caption: String, width: CGFloat = phone.width, height: CGFloat = phone.height, @ViewBuilder view: () -> V) {
    self.caption = caption
    self.width = width
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
            .foregroundStyle(EsuissColor.mutedForeground)
          shot.view
            .frame(width: shot.width, height: shot.height)
            .clipShape(RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous))
            .overlay {
              RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous).strokeBorder(EsuissColor.border)
            }
        }
      }
    }
    .padding(24)
    .fixedSize()
    .background(EsuissColor.background)
  }
}

@MainActor
final class AdminGalleryTests: XCTestCase {
  private func snapshot(_ shots: [Shot], name: String) throws {
    let output = ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
    let width = shots.map(\.width).reduce(0, +) + CGFloat(shots.count - 1) * 24 + 48
    let height = (shots.map(\.height).max() ?? phone.height) + 48 + 28
    let size = CGSize(width: width, height: height)
    for scheme in [ColorScheme.light, .dark] {
      let host = UIHostingController(rootView: Board(shots: shots)
        .frame(width: size.width, height: size.height, alignment: .topLeading)
        .background(EsuissColor.background)
        .environment(\.locale, Locale(identifier: "en_US"))
        .environment(\.chartAnimationActive, false))
      host.safeAreaRegions = []
      let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
      let window = scene.map { UIWindow(windowScene: $0) } ?? UIWindow()
      window.frame = CGRect(origin: .zero, size: size)
      window.overrideUserInterfaceStyle = scheme == .dark ? .dark : .light
      window.rootViewController = host
      window.makeKeyAndVisible()
      host.view.frame = window.bounds
      host.view.layoutIfNeeded()
      RunLoop.main.run(until: Date().addingTimeInterval(2.5))
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

  private var nineFortyOne: Date {
    var components = DateComponents()
    components.year = 2026
    components.month = 10
    components.day = 11
    components.hour = 9
    components.minute = 41
    return Calendar.current.date(from: components) ?? .now
  }

  func testRendersDashHealth() throws {
    try snapshot([
      Shot("Health") { DashHealth(section: nil) },
      Shot("Summary") { DashHealth(section: "Summary") },
      Shot("Editing") { DashHealth(section: "Summary", editing: true, pinned: ["Move", "Sleep"]) },
      Shot("Heart") { DashHealth(section: "Heart") },
    ], name: "blocks-dash-health")
  }

  func testRendersDashAnalytics() throws {
    try snapshot([
      Shot("Route, downloads") { DashAnalytics(app: "route", metric: "downloads") },
      Shot("Fitness+, revenue, week 5") { DashAnalytics(app: "fitness", metric: "revenue", active: 4) },
    ], name: "blocks-dash-analytics")
  }

  func testRendersDashStore() throws {
    try snapshot([
      Shot("Overview") { DashStore(range: "7d", filter: "All") },
      Shot("30 days, Saturday, delivered") { DashStore(range: "30d", filter: "Delivered", active: 5) },
      Shot("Full page", height: 1560) { DashStore(range: "7d", filter: "All") },
    ], name: "blocks-dash-store")
  }

  func testRendersInboxCategories() throws {
    try snapshot([
      Shot("Primary") { InboxCategories(category: "Primary") },
      Shot("Transactions, swipe") { InboxCategories(category: "Transactions", selected: 0, swiped: 5) },
      Shot("Reader, replying") { InboxCategories(category: "Primary", selected: 1, column: .detail, replying: true) },
      Shot("Wide", width: 1024, height: 700) { InboxCategories(category: "Primary", selected: 1) },
    ], name: "blocks-inbox-categories")
  }

  func testRendersInboxMail() throws {
    try snapshot([
      Shot("Mailboxes") { InboxMail(mailbox: "Inbox", column: .sidebar) },
      Shot("Inbox, swipe") { InboxMail(mailbox: "Inbox", swiped: 2) },
      Shot("Search") { InboxMail(mailbox: "Inbox", query: "cloud") },
      Shot("Reader") { InboxMail(mailbox: "Inbox", selected: 1, column: .detail) },
      Shot("Wide", width: 1180, height: 700) { InboxMail(mailbox: "Inbox", selected: 1) },
    ], name: "blocks-inbox-mail")
  }

  func testRendersInboxSupport() throws {
    try snapshot([
      Shot("Views") { InboxSupport(view: "Open", column: .sidebar) },
      Shot("Open, swipe") { InboxSupport(view: "All", swiped: "#4820") },
      Shot("Ticket") { InboxSupport(view: "Open", reply: "We're on it, can you share a video?", column: .detail) },
      Shot("Wide", width: 1180, height: 760) { InboxSupport(view: "Open") },
    ], name: "blocks-inbox-support")
  }

  func testRendersLogActivity() throws {
    try snapshot([
      Shot("All, expanded") { LogActivity(filter: "All", expanded: ["Today-9:41 AM-Jamie Rivera"]) },
      Shot("Content") { LogActivity(filter: "Content") },
    ], name: "blocks-log-activity")
  }

  func testRendersLogLive() throws {
    try snapshot([
      Shot("Running") { LogLive(count: 4, running: true, now: nineFortyOne, ticking: false) },
      Shot("Paused") { LogLive(count: 9, running: false, now: nineFortyOne, ticking: false) },
    ], name: "blocks-log-live")
  }

  func testRendersLogSecurity() throws {
    try snapshot([
      Shot("Open") { LogSecurity(filter: "Open") },
      Shot("All, two resolved") { LogSecurity(filter: "All", resolved: ["5 failed sign-in attempts", "Two-factor authentication is off"]) },
      Shot("Open, none left") { LogSecurity(filter: "Open", resolved: Set(LogSecurity.initialAlerts.map(\.title))) },
    ], name: "blocks-log-security")
  }

  func testRendersUsersTable() throws {
    try snapshot([
      Shot("Default") { UsersTable(role: "All") },
      Shot("Selecting") { UsersTable(role: "All", selected: ["morgan@example.com", "taylor@example.com"]) },
      Shot("Editor, search") { UsersTable(role: "Editor", query: "av") },
    ], name: "blocks-users-table")
  }

  func testRendersUsersInvite() throws {
    try snapshot([
      Shot("Default") { UsersInvite(emails: ["avery@example.com"]) },
      Shot("Several, Support") { UsersInvite(emails: ["avery@example.com", "sam@example.com", "kai@example.com"], draft: "lee@", role: "Support") },
      Shot("Empty") { UsersInvite(emails: [], pending: []) },
    ], name: "blocks-users-invite")
  }

  func testRendersUsersDetail() throws {
    try snapshot([
      Shot("Users") { UsersDetail(selected: 0) },
      Shot("Profile") { UsersDetail(selected: 1, column: .detail) },
      Shot("Sessions") { UsersDetail(selected: 0, tab: "Sessions", column: .detail) },
      Shot("Security") { UsersDetail(selected: 3, tab: "Security", column: .detail) },
      Shot("Wide", width: 1024, height: 700) { UsersDetail(selected: 1) },
    ], name: "blocks-users-detail")
  }

  func testRendersRolesEditor() throws {
    var changed = RolesEditor.defaults
    changed["Support"] = [false, true, false, true, true]
    return try snapshot([
      Shot("Roles") { RolesEditor(role: "Editor") },
      Shot("Editor") { RolesEditor(role: "Editor", column: .detail) },
      Shot("Support, unsaved") { RolesEditor(role: "Support", column: .detail, state: changed) },
      Shot("Wide", width: 1024, height: 700) { RolesEditor(role: "Editor") },
    ], name: "blocks-roles-editor")
  }

  func testRendersRolesRequests() throws {
    var decided = RolesRequests.initialRequests
    decided[0].decision = .approved
    decided[2].decision = .denied
    return try snapshot([
      Shot("Default") { RolesRequests(requests: RolesRequests.initialRequests) },
      Shot("Decided, swipe") { RolesRequests(requests: decided, swiped: "Riley Chen") },
      Shot("Empty") { RolesRequests(requests: []) },
    ], name: "blocks-roles-requests")
  }

  func testAdminDataRules() {
    var entries: [LogLive.Entry] = []
    for id in 0..<10 {
      entries = LogLive.pushed(entries, id: id, time: .now)
    }
    XCTAssertEqual(entries.count, LogLive.limit)
    XCTAssertEqual(entries.first?.id, 9)
    XCTAssertEqual(entries.first?.event.actor, LogLive.feed[3].actor)

    XCTAssertEqual(LogSecurity.score(LogSecurity.initialAlerts), 63)
    XCTAssertEqual(LogSecurity.tone(63), Palette.red500)
    XCTAssertEqual(LogSecurity.score(LogSecurity.initialAlerts.map { var alert = $0; alert.resolved = true; return alert }), 100)

    XCTAssertEqual(UsersInvite.email(" sam@example.com,"), "sam@example.com")
    XCTAssertNil(UsersInvite.email("sam@company"))

    XCTAssertEqual(UsersTable.filtered(UsersTable.initialUsers, role: "Editor", query: "").map(\.name), ["Morgan Lee", "Avery Brooks"])
    XCTAssertEqual(UsersTable.filtered(UsersTable.initialUsers, role: "All", query: "RILEY").count, 1)

    let starred = InboxMail.initialMail.filter { InboxMail.matches($0, mailbox: "Starred", query: "") }
    XCTAssertEqual(starred.map(\.id), [3])
    XCTAssertEqual(InboxMail.initialMail.filter { InboxMail.matches($0, mailbox: "Inbox", query: "cloud") }.map(\.id), [2])

    XCTAssertEqual(RolesEditor.enabled(RolesEditor.defaults)["Editor"], ["Create drafts", "Publish", "Customer data"])
    XCTAssertEqual(DashHealth.cards(section: "Summary", editing: false, pinned: DashHealth.defaultPinned).count, 4)
    XCTAssertEqual(DashHealth.cards(section: "Heart", editing: false, pinned: []).map(\.label), ["Resting Heart Rate", "Cardio Fitness"])
    XCTAssertEqual(LogActivity.filtered("Content").count, 2)
  }
}
