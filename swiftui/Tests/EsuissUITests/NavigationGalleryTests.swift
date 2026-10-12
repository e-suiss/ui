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
      .foregroundStyle(Color.labelSecondary)
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

@MainActor
private func photo(_ index: Int, size: CGSize = CGSize(width: 300, height: 200)) -> Image {
  let palettes: [(Color, Color)] = [
    (.accent, .success),
    (.warning, .danger),
    (.success, .accent),
    (.danger, .warning),
    (.labelSecondary, .accent),
  ]
  let pair = palettes[index % palettes.count]
  let image = UIGraphicsImageRenderer(size: size).image { context in
    let colors = [UIColor(pair.0).cgColor, UIColor(pair.1).cgColor] as CFArray
    let space = CGColorSpaceCreateDeviceRGB()
    if let gradient = CGGradient(colorsSpace: space, colors: colors, locations: [0, 1]) {
      context.cgContext.drawLinearGradient(gradient, start: .zero, end: CGPoint(x: size.width, y: size.height), options: [])
    }
    UIColor(Color.onAccent).withAlphaComponent(0.8).setFill()
    let hill = UIBezierPath()
    hill.move(to: CGPoint(x: 0, y: size.height))
    hill.addLine(to: CGPoint(x: size.width * 0.35, y: size.height * 0.45))
    hill.addLine(to: CGPoint(x: size.width * 0.55, y: size.height * 0.7))
    hill.addLine(to: CGPoint(x: size.width * 0.75, y: size.height * 0.5))
    hill.addLine(to: CGPoint(x: size.width, y: size.height * 0.8))
    hill.addLine(to: CGPoint(x: size.width, y: size.height))
    hill.close()
    hill.fill()
    UIBezierPath(ovalIn: CGRect(x: size.width * 0.72, y: size.height * 0.14, width: size.width * 0.12, height: size.width * 0.12)).fill()
  }
  return Image(uiImage: image)
}

private struct Slide: View {
  let number: Int
  var height: CGFloat = 180

  var body: some View {
    RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
      .fill(Color.surfaceSecondary)
      .overlay {
        Text(verbatim: "\(number)")
          .font(TextStyle.xl3.font(weight: .semibold))
          .foregroundStyle(Color.label)
      }
      .frame(height: height)
  }
}

private struct CarouselGallery: View {
  let controller: CarouselController
  let photos: [Image]

  var body: some View {
    VStack(alignment: .leading, spacing: 28) {
      GallerySection("With page indicator") {
        Carousel(controller: controller) {
          CarouselContent {
            ForEach(1...5, id: \.self) { number in
              CarouselItem { Slide(number: number) }
            }
          }
          PageIndicator(count: controller.count, index: controller.selectedIndex) { controller.scrollTo($0) }
            .padding(.top, 12)
            .frame(maxWidth: .infinity)
        }
      }
      GallerySection("Controls") {
        Carousel {
          CarouselContent {
            ForEach(0..<4, id: \.self) { index in
              CarouselItem {
                photos[index]
                  .resizable()
                  .scaledToFill()
                  .frame(height: 180)
                  .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
              }
            }
          }
          CarouselControls {
            CarouselPrevious()
            Spacer()
            CarouselDots()
            Spacer()
            CarouselNext()
          }
        }
      }
      GallerySection("Half width · loop") {
        Carousel(loop: true) {
          CarouselContent(spacing: 12) {
            ForEach(1...6, id: \.self) { number in
              CarouselItem(basis: 0.5) { Slide(number: number, height: 120) }
            }
          }
          CarouselControls {
            CarouselPrevious(size: .iconSm)
            CarouselNext(size: .iconSm)
            Spacer()
            CarouselDots(variant: .plain)
          }
        }
      }
      GallerySection("Autoplay") {
        Carousel(autoplay: .seconds(5)) {
          CarouselContent {
            ForEach(1...3, id: \.self) { number in
              CarouselItem { Slide(number: number, height: 120) }
            }
          }
          CarouselControls {
            CarouselDots()
            CarouselPlayButton()
          }
        }
      }
      GallerySection("Vertical") {
        Carousel(orientation: .vertical) {
          HStack(spacing: 16) {
            CarouselContent(spacing: 12) {
              ForEach(1...4, id: \.self) { number in
                CarouselItem { Slide(number: number, height: 140) }
              }
            }
            .frame(height: 140)
            VStack(spacing: 12) {
              CarouselPrevious()
              CarouselNext()
            }
          }
        }
      }
    }
    .padding(16)
    .task {
      try? await Task.sleep(for: .milliseconds(200))
      controller.scrollTo(2, animated: false)
    }
  }
}

private struct PageIndicatorGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 28) {
      GallerySection("Default") {
        VStack(alignment: .leading, spacing: 8) {
          PageIndicator(count: 5, index: 0)
          PageIndicator(count: 5, index: 2)
          PageIndicator(count: 5, index: 4)
        }
      }
      GallerySection("Accent") {
        PageIndicator(count: 4, index: 1, variant: .accent)
      }
      GallerySection("Sizes") {
        VStack(alignment: .leading, spacing: 8) {
          ForEach(Array(PageIndicatorSize.allCases.enumerated()), id: \.offset) { _, size in
            PageIndicator(count: 6, index: 2, size: size)
          }
        }
      }
      GallerySection("Many pages · max 7 visible") {
        VStack(alignment: .leading, spacing: 8) {
          PageIndicator(count: 20, index: 0)
          PageIndicator(count: 20, index: 4)
          PageIndicator(count: 20, index: 10)
          PageIndicator(count: 20, index: 19)
          PageIndicator(count: 20, index: 10, size: .sm, variant: .accent)
        }
      }
    }
  }
}

private enum NavTab: Hashable, Sendable {
  case home, search, inbox, profile, settings
}

private struct TabBarSample: View {
  @State var selection: NavTab
  var inboxBadge: TabBarBadge? = 3
  var profileBadge: TabBarBadge? = .dot
  var fiveItems = false

  var body: some View {
    TabBar(selection: $selection) {
      TabBarItem("Home", value: NavTab.home, icon: Ph.house.regular, activeIcon: Ph.house.fill)
      TabBarItem("Search", value: NavTab.search, icon: Ph.magnifyingGlass.regular, activeIcon: Ph.magnifyingGlass.bold)
      TabBarItem("Inbox", value: NavTab.inbox, icon: Ph.tray.regular, activeIcon: Ph.tray.fill, badge: inboxBadge)
      TabBarItem("Profile", value: NavTab.profile, icon: Ph.user.regular, activeIcon: Ph.user.fill, badge: profileBadge)
      if fiveItems {
        TabBarItem("Settings", value: NavTab.settings, icon: Ph.gear.regular, activeIcon: Ph.gear.fill, badge: "New")
      }
    }
  }
}

private struct TabBarGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 28) {
      GallerySection("Badges") {
        TabBarSample(selection: .home)
      }
      GallerySection("Inbox selected · 120 unread") {
        TabBarSample(selection: .inbox, inboxBadge: 120, profileBadge: nil)
      }
      GallerySection("Five items") {
        TabBarSample(selection: .settings, inboxBadge: 8, fiveItems: true)
      }
      GallerySection("Secondary screen") {
        Screen(background: .surfaceSecondary) {
          RoundedRectangle(cornerRadius: Radius.md).fill(Color.surface).frame(height: 60).padding(16)
          TabBarSample(selection: .search)
        }
        .fixedSize(horizontal: false, vertical: true)
      }
    }
  }
}

private let contacts: [(String, [String])] = [
  ("A", ["Aaliyah Brooks", "Adrian Cole", "Amelia Ford"]),
  ("B", ["Benjamin Hart", "Bianca Moreno"]),
  ("C", ["Caleb Nguyen", "Chloe Park", "Cora Diaz"]),
  ("D", ["Daniel Reed", "Dina Wolf"]),
  ("E", ["Elena Rossi", "Ethan Shaw"]),
  ("G", ["Grace Kim"]),
  ("J", ["Jordan Lee", "Julia Stone"]),
  ("M", ["Mason Gray", "Mia Lopez", "Miles Young"]),
  ("S", ["Sofia Blake", "Sam Turner"]),
  ("Z", ["Zoe Adams"]),
]

private struct ContactRow: View {
  let name: String

  var body: some View {
    HStack(spacing: 12) {
      Avatar(url: nil, initials: String(name.split(separator: " ").compactMap(\.first)))
      Text(verbatim: name)
        .font(TextStyle.base.font())
        .foregroundStyle(Color.label)
      Spacer(minLength: 0)
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 8)
    .overlay(alignment: .bottom) {
      Color.separator.frame(height: 1).padding(.leading, 68)
    }
  }
}

private struct SectionIndexGallery: View {
  let dragging: Bool

  var body: some View {
    SectionIndex {
      ScrollView {
        LazyVStack(alignment: .leading, spacing: 0, pinnedViews: .sectionHeaders) {
          ForEach(contacts, id: \.0) { entry in
            SectionIndexSection(entry.0) {
              ForEach(entry.1, id: \.self) { name in
                ContactRow(name: name)
              }
            }
          }
        }
        .padding(.trailing, 20)
      }
      if dragging {
        SectionIndexBar(dragging: 12, at: 12 * 16 + 8)
      } else {
        SectionIndexBar()
      }
    }
    .frame(height: dragging ? 640 : 300)
  }
}

private struct PhotoTile: View {
  let image: Image

  var body: some View {
    image
      .resizable()
      .scaledToFill()
      .frame(maxWidth: .infinity)
      .frame(height: 110)
      .clipShape(RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
  }
}

private struct PreviewMenuGallery: View {
  let photos: [Image]

  var body: some View {
    GeometryReader { proxy in
      let columns = Array(repeating: GridItem(.flexible(), spacing: 8), count: 3)
      let width = (proxy.size.width - 32 - 16) / 3
      let source = CGRect(x: 16 + width + 8, y: 16 + 118, width: width, height: 110)
      ZStack(alignment: .topLeading) {
        LazyVGrid(columns: columns, spacing: 8) {
          ForEach(0..<15, id: \.self) { index in
            PhotoTile(image: photos[index % photos.count])
              .opacity(index == 4 ? 0 : 1)
          }
        }
        .padding(16)
        PreviewMenuCanvas(
          source: source,
          aspectRatio: nil,
          visible: true,
          trigger: { PhotoTile(image: photos[4 % photos.count]) },
          items: {
            PreviewMenuItem("Share", icon: Ph.export.regular) {}
            PreviewMenuItem("Add to Favorites", icon: Ph.heart.regular) {}
            PreviewMenuItem("Copy", icon: Ph.copy.regular) {}
            PreviewMenuSeparator()
            PreviewMenuItem("Delete", icon: Ph.trash.regular, variant: .destructive) {}
          },
          preview: Optional<() -> EmptyView>.none
        )
      }
    }
    .frame(height: 760)
  }
}

private struct CustomPreviewMenuGallery: View {
  let photos: [Image]

  var body: some View {
    GeometryReader { _ in
      let source = CGRect(x: 16, y: 120, width: 370, height: 72)
      ZStack(alignment: .topLeading) {
        VStack(spacing: 0) {
          ForEach(0..<6, id: \.self) { index in
            HStack(spacing: 12) {
              photos[index % photos.count].resizable().scaledToFill().frame(width: 48, height: 48).clipShape(Circle())
              VStack(alignment: .leading, spacing: 2) {
                Text(verbatim: "Album \(index + 1)").font(TextStyle.base.font(weight: .semibold))
                Text(verbatim: "\(12 + index * 7) photos").font(TextStyle.sm.font()).foregroundStyle(Color.labelSecondary)
              }
              Spacer()
            }
            .foregroundStyle(Color.label)
            .padding(12)
          }
        }
        .padding(.top, 48)
        .padding(.horizontal, 16)
        PreviewMenuCanvas(
          source: source,
          aspectRatio: 4 / 3,
          visible: true,
          trigger: { EmptyView() },
          items: {
            PreviewMenuItem("Open", icon: Ph.arrowSquareOut.regular) {}
            PreviewMenuItem("Rename", icon: Ph.pencilSimple.regular) {}
            PreviewMenuItem("Delete Album", icon: Ph.trash.regular, variant: .destructive) {}
            PreviewMenuItem("Unavailable", icon: Ph.lock.regular) {}.disabled(true)
          },
          preview: {
            photos[1].resizable().scaledToFill()
          }
        )
      }
    }
    .frame(height: 700)
  }
}

private struct MailItem: View {
  let from: String
  let subject: String

  var body: some View {
    Text(verbatim: from).font(TextStyle.base.font(weight: .semibold))
    Text(verbatim: subject).font(TextStyle.sm.font()).foregroundStyle(Color.labelSecondary).lineLimit(1)
  }
}

private struct SplitViewSample: View {
  @State var column: SplitViewColumn
  var sidebar = true

  var body: some View {
    SplitView(column: $column) {
      if sidebar {
        SplitViewSidebar("Mailboxes") {
          SplitViewItem(isActive: true) { Text("Inbox") }
          SplitViewItem { Text("Drafts") }
          SplitViewItem { Text("Sent") }
          SplitViewItem { Text("Archive") }
        }
      }
      SplitViewList("Inbox") {
        SplitViewItem(isActive: true) { MailItem(from: "Jordan Lee", subject: "Launch moved to Thursday") }
        SplitViewItem { MailItem(from: "Mia Lopez", subject: "Design review notes") }
        SplitViewItem { MailItem(from: "Sam Turner", subject: "Quarterly report draft") }
        SplitViewItem { MailItem(from: "Grace Kim", subject: "Team offsite plans") }
      }
      SplitViewDetail("Launch moved to Thursday") {
        VStack(alignment: .leading, spacing: 12) {
          Text(verbatim: "From Jordan Lee · 9:41 AM")
            .font(TextStyle.sm.font())
            .foregroundStyle(Color.labelSecondary)
          Text(verbatim: "Morning! The client moved the launch to Thursday. Can we trim the scope a little and ship onboarding behind a flag?")
            .font(TextStyle.base.font())
            .foregroundStyle(Color.label)
            .fixedSize(horizontal: false, vertical: true)
        }
      }
    }
  }
}

private struct SplitViewCompactGallery: View {
  var body: some View {
    VStack(spacing: 0) {
      Caption(text: "Compact · detail column").padding(16)
      SplitViewSample(column: .detail).frame(height: 300)
      Separator()
      Caption(text: "Compact · list column").padding(16)
      SplitViewSample(column: .list).frame(height: 380)
      Separator()
      Caption(text: "Compact · list column without sidebar").padding(16)
      SplitViewSample(column: .list, sidebar: false).frame(height: 320)
    }
  }
}

private struct SplitViewWideGallery: View {
  var body: some View {
    VStack(spacing: 0) {
      SplitViewSample(column: .detail).frame(height: 420)
      Separator()
      SplitViewSample(column: .detail, sidebar: false).frame(height: 360)
    }
  }
}

private struct ImageViewerGallery: View {
  let photos: [Image]

  @State private var index = 1

  var body: some View {
    ImageViewer(images: photos, index: $index)
      .frame(height: 760)
  }
}

private struct PreviewGallery: View {
  var body: some View {
    VStack(spacing: 0) {
      ZStack(alignment: .bottom) {
        VStack(alignment: .leading, spacing: 12) {
          Text("Read the release notes for")
            .font(TextStyle.base.font())
            .foregroundStyle(Color.label)
          Text("esuiss/uim")
            .font(TextStyle.base.font())
            .foregroundStyle(Color.link)
          Spacer()
        }
        .padding(16)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        Color.scrim
        PreviewContent(showCloseButton: true) {
          HStack(spacing: 12) {
            Avatar(url: nil, initials: "EU")
            VStack(alignment: .leading, spacing: 2) {
              Text("esuiss/uim").font(TextStyle.base.font(weight: .semibold)).foregroundStyle(Color.label)
              Text("Mobile UI components with a clean, minimal design.")
                .font(TextStyle.sm.font())
                .foregroundStyle(Color.labelSecondary)
                .fixedSize(horizontal: false, vertical: true)
            }
          }
          Text("Updated 2 hours ago").font(TextStyle.xs.font()).foregroundStyle(Color.labelSecondary)
        }
        .environment(\.drawerFitsContent, true)
        .overlay(alignment: .top) {
          Capsule().fill(Color.labelQuaternary).frame(width: 36, height: 5).padding(.top, 5)
        }
        .clipShape(UnevenRoundedRectangle(topLeadingRadius: Radius.xl3, topTrailingRadius: Radius.xl3, style: .continuous))
      }
      .frame(height: 320)
      .clipped()
      VStack(alignment: .leading, spacing: 12) {
        Caption(text: "Regular · popover")
        PreviewContent {
          VStack(alignment: .leading, spacing: 2) {
            Text("esuiss/uim").font(TextStyle.base.font(weight: .semibold))
            Text("Mobile UI components with a clean, minimal design.")
              .font(TextStyle.sm.font())
              .foregroundStyle(Color.labelSecondary)
          }
          Text("Updated 2 hours ago").font(TextStyle.xs.font()).foregroundStyle(Color.labelSecondary)
        }
        .popupSurface(radius: 13)
        .environment(\.patternCompact, false)
      }
      .padding(16)
    }
    .environment(\.patternCompact, true)
  }
}

@MainActor
final class NavigationGalleryTests: XCTestCase {
  private var output: String {
    ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
  }

  private var photos: [Image] {
    (0..<5).map { photo($0) }
  }

  private func render<V: View>(_ view: V, name: String, padding: CGFloat = 16, width: CGFloat = 402) throws {
    for scheme in [ColorScheme.light, .dark] {
      let renderer = ImageRenderer(content: view
        .padding(padding)
        .frame(width: width, alignment: .leading)
        .background(Color.surface)
        .environment(\.colorScheme, scheme)
        .environment(\.locale, Locale(identifier: "en_US")))
      renderer.scale = 3
      let data = try XCTUnwrap(renderer.uiImage?.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  private func snapshot<V: View>(
    _ view: V,
    name: String,
    width: CGFloat = 402,
    wait: TimeInterval = 0.8
  ) throws {
    for scheme in [ColorScheme.light, .dark] {
      let host = UIHostingController(rootView: view
        .frame(width: width, alignment: .leading)
        .background(Color.surface)
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

  func testRendersCarouselGalleryAndScrollsToIndex() throws {
    let controller = CarouselController()
    try snapshot(CarouselGallery(controller: controller, photos: photos), name: "navigation-carousel", wait: 1.2)
    XCTAssertEqual(controller.count, 5)
    XCTAssertEqual(controller.selectedIndex, 2)
    XCTAssertTrue(controller.canScrollPrev)
    XCTAssertTrue(controller.canScrollNext)
  }

  func testRendersPageIndicatorGallery() throws {
    try render(PageIndicatorGallery(), name: "navigation-page-indicator")
  }

  func testRendersTabBarGallery() throws {
    try render(TabBarGallery(), name: "navigation-tab-bar")
  }

  func testRendersSectionIndexGallery() throws {
    try snapshot(SectionIndexGallery(dragging: true), name: "navigation-section-index")
  }

  func testRendersPreviewMenuGallery() throws {
    try snapshot(PreviewMenuGallery(photos: photos), name: "navigation-preview-menu")
    try snapshot(CustomPreviewMenuGallery(photos: photos), name: "navigation-preview-menu-custom")
  }

  func testRendersPreviewGallery() throws {
    try render(PreviewGallery(), name: "navigation-preview", padding: 0)
  }

  func testRendersSplitViewGalleries() throws {
    try snapshot(SplitViewCompactGallery(), name: "navigation-split-view-compact")
    try snapshot(SplitViewWideGallery(), name: "navigation-split-view-wide", width: 1024)
  }

  func testRendersImageViewerGallery() throws {
    try snapshot(ImageViewerGallery(photos: photos), name: "navigation-image-viewer")
  }

  func testCarouselStepsClampAndLoop() {
    XCTAssertEqual(CarouselMath.step(from: 0, by: 1, count: 5, loop: false), 1)
    XCTAssertNil(CarouselMath.step(from: 4, by: 1, count: 5, loop: false))
    XCTAssertNil(CarouselMath.step(from: 0, by: -1, count: 5, loop: false))
    XCTAssertEqual(CarouselMath.step(from: 4, by: 1, count: 5, loop: true), 0)
    XCTAssertEqual(CarouselMath.step(from: 0, by: -1, count: 5, loop: true), 4)
    XCTAssertNil(CarouselMath.step(from: 0, by: 1, count: 1, loop: true))
    XCTAssertNil(CarouselMath.step(from: 0, by: 1, count: 0, loop: false))
    XCTAssertEqual(CarouselMath.autoplayTarget(from: 4, count: 5, loop: false), 0)
    XCTAssertEqual(CarouselMath.autoplayTarget(from: 1, count: 5, loop: false), 2)
    XCTAssertNil(CarouselMath.autoplayTarget(from: 0, count: 1, loop: false))
    XCTAssertEqual(CarouselMath.clamp(9, count: 3), 2)
    XCTAssertEqual(CarouselMath.clamp(-2, count: 3), 0)
  }

  func testCarouselControllerTracksScrollPosition() {
    let controller = CarouselController()
    let keys = (0..<4).map { _ in UUID() }
    controller.register(keys)
    XCTAssertEqual(controller.count, 4)
    XCTAssertFalse(controller.canScrollPrev)
    controller.position = keys[3]
    XCTAssertEqual(controller.selectedIndex, 3)
    XCTAssertFalse(controller.canScrollNext)
    controller.scrollPrev()
    XCTAssertEqual(controller.selectedIndex, 2)
    XCTAssertEqual(controller.position, keys[2])
    controller.scrollTo(10, animated: false)
    XCTAssertEqual(controller.selectedIndex, 3)
    controller.register(Array(keys.prefix(2)))
    XCTAssertEqual(controller.selectedIndex, 1)
    controller.setPlaying(true)
    XCTAssertFalse(controller.isPlaying)
  }

  func testPageIndicatorWindowsLargeCounts() {
    XCTAssertEqual(PageIndicatorMath.window(count: 5, index: 3, maxVisible: 7), 0..<5)
    XCTAssertEqual(PageIndicatorMath.window(count: 20, index: 0, maxVisible: 7), 0..<7)
    XCTAssertEqual(PageIndicatorMath.window(count: 20, index: 10, maxVisible: 7), 7..<14)
    XCTAssertEqual(PageIndicatorMath.window(count: 20, index: 19, maxVisible: 7), 13..<20)
    XCTAssertEqual(PageIndicatorMath.window(count: 20, index: 10, maxVisible: 2), 8..<13)
    let start = PageIndicatorMath.dots(count: 20, index: 0, maxVisible: 7).map(\.scale)
    XCTAssertEqual(start, [1, 1, 1, 1, 1, 0.75, 0.5])
    let middle = PageIndicatorMath.dots(count: 20, index: 10, maxVisible: 7)
    XCTAssertEqual(middle.map(\.scale), [0.5, 0.75, 1, 1, 1, 0.75, 0.5])
    XCTAssertEqual(middle.first { $0.page == 10 }?.scale, 1)
    let end = PageIndicatorMath.dots(count: 20, index: 19, maxVisible: 7).map(\.scale)
    XCTAssertEqual(end, [0.5, 0.75, 1, 1, 1, 1, 1])
    XCTAssertTrue(PageIndicatorMath.dots(count: 0, index: 0, maxVisible: 7).isEmpty)
  }

  func testSectionIndexHitTestingAndTargets() {
    let letters = SectionIndexMath.letters
    XCTAssertEqual(letters.count, 27)
    let height = CGFloat(letters.count) * 16
    XCTAssertEqual(SectionIndexMath.index(at: -20, height: height, count: 27), 0)
    XCTAssertEqual(SectionIndexMath.index(at: 0, height: height, count: 27), 0)
    XCTAssertEqual(SectionIndexMath.index(at: 15.9, height: height, count: 27), 0)
    XCTAssertEqual(SectionIndexMath.index(at: 16, height: height, count: 27), 1)
    XCTAssertEqual(SectionIndexMath.index(at: 12 * 16 + 8, height: height, count: 27), 12)
    XCTAssertEqual(SectionIndexMath.index(at: height, height: height, count: 27), 26)
    XCTAssertEqual(SectionIndexMath.index(at: height + 40, height: height, count: 27), 26)
    let sections = ["A", "B", "M", "S"]
    XCTAssertEqual(SectionIndexMath.target(sections: sections, letters: letters, index: 0), "A")
    XCTAssertEqual(SectionIndexMath.target(sections: sections, letters: letters, index: 2), "M")
    XCTAssertEqual(SectionIndexMath.target(sections: sections, letters: letters, index: 12), "M")
    XCTAssertEqual(SectionIndexMath.target(sections: sections, letters: letters, index: 25), "S")
    XCTAssertNil(SectionIndexMath.target(sections: [], letters: letters, index: 3))
    XCTAssertEqual(SectionIndexMath.capacity(height: 300), 17)
    let compact = SectionIndexMath.displayItems(letters, capacity: 10)
    XCTAssertEqual(compact.count, 9)
    XCTAssertEqual(compact.first?.label, "A")
    XCTAssertEqual(compact.last?.label, "#")
    XCTAssertEqual(compact[1].label, "•")
    XCTAssertEqual(Set(compact.map(\.key)).count, compact.count)
    XCTAssertEqual(SectionIndexMath.displayItems(letters, capacity: 40).count, 27)
  }

  func testSplitViewColumnSwitching() {
    XCTAssertEqual(SplitViewColumn.sidebar.next, .list)
    XCTAssertEqual(SplitViewColumn.list.next, .detail)
    XCTAssertEqual(SplitViewColumn.detail.next, .detail)
    XCTAssertEqual(SplitViewMath.backColumn(for: .detail, present: [.sidebar, .list, .detail]), .list)
    XCTAssertEqual(SplitViewMath.backColumn(for: .list, present: [.sidebar, .list, .detail]), .sidebar)
    XCTAssertNil(SplitViewMath.backColumn(for: .list, present: [.list, .detail]))
    XCTAssertNil(SplitViewMath.backColumn(for: .sidebar, present: [.sidebar, .list, .detail]))
    XCTAssertFalse(SplitViewMath.isWide(767))
    XCTAssertTrue(SplitViewMath.isWide(768))
    let three = SplitViewMath.widths(total: 1002, present: [.sidebar, .list, .detail])
    XCTAssertEqual(three[.sidebar], 200)
    XCTAssertEqual(three[.list], 320)
    XCTAssertEqual(three[.detail], 480)
    let two = SplitViewMath.widths(total: 801, present: [.list, .detail])
    XCTAssertEqual(two[.list], 320)
    XCTAssertEqual(two[.detail], 480)
  }

  func testImageViewerZoomClampingAndPaging() {
    let size = CGSize(width: 400, height: 800)
    XCTAssertEqual(ImageViewerMath.clampScale(0.4), 1)
    XCTAssertEqual(ImageViewerMath.clampScale(2.2), 2.2)
    XCTAssertEqual(ImageViewerMath.clampScale(9), 4)
    XCTAssertEqual(ImageViewerMath.clampOffset(CGSize(width: 50, height: 50), scale: 1, size: size), .zero)
    XCTAssertEqual(ImageViewerMath.clampOffset(CGSize(width: 900, height: -900), scale: 2, size: size), CGSize(width: 200, height: -400))
    XCTAssertEqual(ImageViewerMath.clampOffset(CGSize(width: 30, height: 40), scale: 2, size: size), CGSize(width: 30, height: 40))
    let zoomIn = ImageViewerMath.doubleTap(scale: 1, location: CGPoint(x: 200, y: 400), size: size)
    XCTAssertEqual(zoomIn.scale, 2.5)
    XCTAssertEqual(zoomIn.offset, .zero)
    let corner = ImageViewerMath.doubleTap(scale: 1, location: .zero, size: size)
    XCTAssertEqual(corner.offset, CGSize(width: 300, height: 600))
    let zoomOut = ImageViewerMath.doubleTap(scale: 3, location: .zero, size: size)
    XCTAssertEqual(zoomOut.scale, 1)
    XCTAssertEqual(zoomOut.offset, .zero)
    XCTAssertEqual(ImageViewerMath.page(current: 1, translation: -120, predicted: -120, width: 400, count: 5), 2)
    XCTAssertEqual(ImageViewerMath.page(current: 1, translation: -40, predicted: -260, width: 400, count: 5), 2)
    XCTAssertEqual(ImageViewerMath.page(current: 1, translation: -40, predicted: -60, width: 400, count: 5), 1)
    XCTAssertEqual(ImageViewerMath.page(current: 0, translation: 200, predicted: 300, width: 400, count: 5), 0)
    XCTAssertEqual(ImageViewerMath.page(current: 4, translation: -200, predicted: -300, width: 400, count: 5), 4)
    XCTAssertEqual(ImageViewerMath.resisted(90, current: 0, count: 5), 30)
    XCTAssertEqual(ImageViewerMath.resisted(90, current: 2, count: 5), 90)
    XCTAssertTrue(ImageViewerMath.shouldDismiss(translation: 140, predicted: 140))
    XCTAssertTrue(ImageViewerMath.shouldDismiss(translation: 40, predicted: 400))
    XCTAssertFalse(ImageViewerMath.shouldDismiss(translation: 40, predicted: 80))
    XCTAssertEqual(ImageViewerMath.backdropOpacity(150), 0.5)
    XCTAssertEqual(ImageViewerMath.backdropOpacity(-600), 0)
  }

  func testPreviewMenuFrameFitsAboveTheMenu() {
    let viewport = CGSize(width: 402, height: 874)
    let tile = CGRect(x: 141, y: 134, width: 120, height: 110)
    let frame = PreviewMenuMath.frame(trigger: tile, viewport: viewport, aspectRatio: nil, menuHeight: 200)
    XCTAssertEqual(frame.width, 360)
    XCTAssertEqual(frame.height, 330, accuracy: 0.01)
    XCTAssertEqual(frame.minX, 21)
    XCTAssertEqual(frame.minY, 166, accuracy: 0.01)
    XCTAssertEqual(frame.minY - PreviewMenuMath.edge, viewport.height - PreviewMenuMath.edge - (frame.maxY + PreviewMenuMath.menuGap + 200), accuracy: 0.01)
    let low = PreviewMenuMath.frame(trigger: CGRect(x: 16, y: 760, width: 370, height: 80), viewport: viewport, aspectRatio: 4 / 3, menuHeight: 200)
    XCTAssertEqual(low.height, 270, accuracy: 0.01)
    XCTAssertEqual(low.minY, 196, accuracy: 0.01)
    let tall = PreviewMenuMath.frame(trigger: CGRect(x: 0, y: 0, width: 100, height: 400), viewport: viewport, aspectRatio: nil, menuHeight: 600)
    XCTAssertEqual(tall.height, viewport.height - PreviewMenuMath.menuSpace - 32, accuracy: 0.01)
    XCTAssertEqual(tall.minY, PreviewMenuMath.edge, accuracy: 0.01)
    let short = PreviewMenuMath.frame(trigger: CGRect(x: 0, y: 0, width: 100, height: 400), viewport: viewport, aspectRatio: nil, menuHeight: 100)
    XCTAssertEqual(short.height, viewport.height - 112 - 32, accuracy: 0.01)
    XCTAssertEqual(PreviewMenuMath.menuMaxHeight(trigger: tile, viewport: viewport, aspectRatio: nil), 500, accuracy: 0.01)
    let menu = PreviewMenuMath.menuOrigin(preview: frame, menu: CGSize(width: 250, height: 200), viewport: viewport)
    XCTAssertEqual(menu.x, 76)
    XCTAssertEqual(menu.y, frame.maxY + 12)
  }

  func testTabBarBadgeLabels() {
    XCTAssertEqual(TabBarBadge.count(3).label, "3")
    XCTAssertEqual(TabBarBadge.count(120).label, "99+")
    XCTAssertFalse(TabBarBadge.count(0).isVisible)
    XCTAssertNil(TabBarBadge.dot.label)
    XCTAssertTrue(TabBarBadge.dot.isVisible)
    let literal: TabBarBadge = "New"
    XCTAssertEqual(literal, .text("New"))
    let number: TabBarBadge = 7
    XCTAssertEqual(number, .count(7))
  }
}
