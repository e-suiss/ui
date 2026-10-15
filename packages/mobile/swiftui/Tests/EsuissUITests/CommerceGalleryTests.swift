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
            .foregroundStyle(EsuissColor.mutedForeground)
          shot.view
            .frame(width: phone.width, height: shot.height)
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
final class CommerceGalleryTests: XCTestCase {
  private func snapshot(_ shots: [Shot], name: String) throws {
    let output = ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
    let width = CGFloat(shots.count) * phone.width + CGFloat(shots.count - 1) * 24 + 48
    let height = (shots.map(\.height).max() ?? phone.height) + 48 + 28
    let size = CGSize(width: width, height: height)
    for scheme in [ColorScheme.light, .dark] {
      let host = UIHostingController(rootView: Board(shots: shots)
        .frame(width: size.width, height: size.height, alignment: .topLeading)
        .background(EsuissColor.background)
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

  func testRendersChatConversations() throws {
    try snapshot([
      Shot("Conversations") { ChatConversations(selected: nil) },
      Shot("Swipe to delete") { ChatConversations(selected: nil, swiped: 1) },
      Shot("Thread") { ChatConversations(selected: 0) },
      Shot("Typing") { ChatConversations(selected: 0, typing: true, draft: "See you there") },
    ], name: "blocks-chat-conversations")
  }

  func testRendersChatSupport() throws {
    try snapshot([
      Shot("Open") { ChatSupport(open: true) },
      Shot("Answered, typing") { ChatSupport(open: true, asked: ["Where's my order?", "Book a repair"], typing: true) },
      Shot("Closed") { ChatSupport(open: false) },
    ], name: "blocks-chat-support")
  }

  func testRendersChatThread() throws {
    var liked = ChatThread.opening
    liked[0].liked = true
    liked[2].liked = true
    return try snapshot([
      Shot("Default") { ChatThread(lines: ChatThread.opening) },
      Shot("Hearts, typing") { ChatThread(lines: liked, typing: true, draft: "Can't wait") },
    ], name: "blocks-chat-thread")
  }

  func testRendersBagCheckout() throws {
    try snapshot([
      Shot("Delivery") { BagCheckout(step: 0) },
      Shot("Payment") { BagCheckout(step: 1, shipping: "express") },
      Shot("Review") { BagCheckout(step: 2, shipping: "express", payment: "pay") },
      Shot("Placed") { BagCheckout(step: 2, placed: true) },
    ], name: "blocks-bag-checkout")
  }

  func testRendersBagConfigure() throws {
    try snapshot([
      Shot("Default") { BagConfigure(model: "Phone Pro") },
      Shot("Configured") { BagConfigure(model: "Phone Pro Max", finish: "Silver", size: "1 TB", added: true) },
      Shot("Full height", height: 1060) { BagConfigure(model: "Phone Pro", finish: "Deep Blue", size: "512 GB") },
    ], name: "blocks-bag-configure")
  }

  func testRendersBagReview() throws {
    let empty = BagReview.initialItems.map { item in
      var item = item
      item.quantity = 0
      return item
    }
    try snapshot([
      Shot("Default") { BagReview(items: BagReview.initialItems) },
      Shot("Full height", height: 1180) { BagReview(items: BagReview.initialItems) },
      Shot("Empty") { BagReview(items: empty) },
    ], name: "blocks-bag-review")
  }

  func testRendersPriceBundle() throws {
    try snapshot([
      Shot("Family") { PriceBundle(selected: "Family") },
      Shot("Premier (full height)", height: 1240) { PriceBundle(selected: "Premier") },
    ], name: "blocks-price-bundle")
  }

  func testRendersPriceCare() throws {
    try snapshot([
      Shot("Phone Pro") { PriceCare(device: "Phone Pro", theft: true) },
      Shot("Book Air") { PriceCare(device: "Book Air", option: "Annual") },
    ], name: "blocks-price-care")
  }

  func testRendersPriceStorage() throws {
    try snapshot([
      Shot("Monthly") { PriceStorage(period: .monthly) },
      Shot("Yearly (full height)", height: 1220) { PriceStorage(period: .yearly, selected: "2 TB", updated: true) },
    ], name: "blocks-price-storage")
  }

  func testRendersGridCarousel() throws {
    try snapshot([
      Shot("Default") { GridCarousel() },
      Shot("Third card") { GridCarousel(index: 2) },
    ], name: "blocks-grid-carousel")
  }

  func testRendersGridAccessories() throws {
    try snapshot([
      Shot("All") { GridAccessories(filter: "All") },
      Shot("Audio, in bag") { GridAccessories(filter: "Audio", bag: ["Pods Sage Headphones", "Sport Band"]) },
    ], name: "blocks-grid-accessories")
  }

  func testRendersGridLineup() throws {
    try snapshot([
      Shot("Default") { GridLineup() },
      Shot("Full height", height: 1460) { GridLineup() },
    ], name: "blocks-grid-lineup")
  }

  func testRendersNavCategories() throws {
    try snapshot([
      Shot("Phone") { NavCategories(selected: "Phone") },
      Shot("Watch") { NavCategories(selected: "Watch") },
    ], name: "blocks-nav-categories")
  }

  func testChatDataParsesSendersAndAnswers() {
    let lines = ChatConversations.lines(ChatConversations.threads[0], index: 0)
    XCTAssertEqual(lines.map(\.fromMe), [false, true, true, false])
    XCTAssertEqual(lines[2].text, "I booked the boat tour, it leaves at 5 AM")
    XCTAssertEqual(Set(ChatSupport.quick), Set(ChatSupport.answers.keys))
  }
}
