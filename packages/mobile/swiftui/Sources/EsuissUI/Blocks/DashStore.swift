import Charts
import PhosphorSwift
import SwiftUI

public struct DashStore: View {
  struct Order: Identifiable {
    let id: String
    let name: String
    let product: String
    let status: String
    let total: Double
    let tint: Color
  }

  static let ranges: [(value: String, label: String, scale: Double)] = [
    ("24h", "24 Hours", 0.15), ("7d", "7 Days", 1), ("30d", "30 Days", 4.3),
  ]

  static let week: [(day: String, online: Double, store: Double)] = [
    ("Mon", 42, 46), ("Tue", 58, 44), ("Wed", 50, 56), ("Thu", 68, 54),
    ("Fri", 64, 70), ("Sat", 80, 62), ("Sun", 72, 76),
  ]

  static let stores = ["Union Square", "Fifth Avenue", "Michigan Avenue"]

  static var orders: [Order] {
    [
      Order(id: "W1048", name: "Jamie Rivera", product: "Phone Pro", status: "Shipped", total: 999, tint: Palette.indigo500),
      Order(id: "W1047", name: "Morgan Lee", product: "Book Air", status: "Processing", total: 1099, tint: Palette.orange500),
      Order(id: "W1046", name: "Riley Chen", product: "Watch Series 11", status: "Delivered", total: 399, tint: Palette.green500),
      Order(id: "W1045", name: "Avery Brooks", product: "Pods Studio", status: "Returned", total: 549, tint: Palette.pink500),
      Order(id: "W1044", name: "Taylor Kim", product: "Pad Air", status: "Delivered", total: 599, tint: Palette.cyan500),
    ]
  }

  static let filters = ["All", "Shipped", "Delivered", "Returned"]

  static func filtered(_ filter: String) -> [Order] {
    orders.filter { filter == "All" || $0.status == filter }
  }

  private let chartConfig: ChartConfig = [
    "online": .init("Online", color: Palette.blue500),
    "store": .init("In store", color: Palette.teal500),
  ]

  private var onRangeChange: ((String) -> Void)?
  private var onFilterChange: ((String) -> Void)?
  private var onStoreChange: ((String?) -> Void)?
  private var onOrderPress: ((String) -> Void)?
  private var onNavigate: ((String) -> Void)?
  @State private var range: String?
  @State private var filter: String?
  @State private var store: String
  @State private var active: Int?
  @Environment(\.locale) private var locale
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onRangeChange: ((_ range: String) -> Void)? = nil,
    onFilterChange: ((_ status: String) -> Void)? = nil,
    onStoreChange: ((_ store: String?) -> Void)? = nil,
    onOrderPress: ((_ id: String) -> Void)? = nil,
    onNavigate: ((_ section: String) -> Void)? = nil
  ) {
    self.init(range: "7d", filter: "All")
    self.onRangeChange = onRangeChange
    self.onFilterChange = onFilterChange
    self.onStoreChange = onStoreChange
    self.onOrderPress = onOrderPress
    self.onNavigate = onNavigate
  }

  init(range: String, filter: String, active: Int? = nil) {
    _range = State(initialValue: range)
    _filter = State(initialValue: filter)
    _store = State(initialValue: "")
    _active = State(initialValue: active)
  }

  private var animation: Animation? {
    reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.5)
  }

  private var rangeBinding: Binding<String?> {
    Binding(
      get: { range },
      set: { value in
        guard let value, value != range else { return }
        onRangeChange?(value)
        withAnimation(animation) { range = value }
      }
    )
  }

  private var filterBinding: Binding<String?> {
    Binding(
      get: { filter },
      set: { value in
        guard let value, value != filter else { return }
        onFilterChange?(value)
        withAnimation(animation) { filter = value }
      }
    )
  }

  private var storeBinding: Binding<String> {
    Binding(
      get: { store },
      set: { value in
        guard value != store else { return }
        onStoreChange?(value.isEmpty ? nil : value)
        store = value
      }
    )
  }

  private func money(_ value: Double) -> String {
    value.formatted(.currency(code: "USD").precision(.fractionLength(0)).locale(locale))
  }

  public var body: some View {
    DashStoreShell(onNavigate: onNavigate) {
      page
    }
  }

  private var page: some View {
    let scale = Self.ranges.first { $0.value == range }?.scale ?? 1
    let stats: [(label: String, value: String, change: String, up: Bool)] = [
      ("Revenue", money(1284500 * scale), "+12.4%", true),
      ("Orders", (842 * scale).rounded().formatted(.number.locale(locale)), "+8.1%", true),
      ("Average order", money(1525), "−2.3%", false),
      ("Conversion", "3.42%", "+0.4 pts", true),
    ]
    return Screen {
      HeaderScrollView {
        HeaderLargeTitle("Overview", subtitle: store.isEmpty ? "All stores" : LocalizedStringKey(store))
        VStack(alignment: .leading, spacing: 20) {
          ToggleGroup(selection: rangeBinding, size: .sm, spacing: 0) {
            ForEach(Self.ranges, id: \.value) { item in
              ToggleGroupItem(LocalizedStringKey(item.label), value: item.value)
            }
          }
          .accessibilityLabel("Range")
          Grid(alignment: .topLeading, horizontalSpacing: 0, verticalSpacing: 0) {
            GridRow {
              stat(stats[0])
              stat(stats[1]).overlay(alignment: .leading) { EsuissColor.border.frame(width: 1) }
            }
            GridRow {
              stat(stats[2]).overlay(alignment: .top) { EsuissColor.border.frame(height: 1) }
              stat(stats[3])
                .overlay(alignment: .top) { EsuissColor.border.frame(height: 1) }
                .overlay(alignment: .leading) { EsuissColor.border.frame(width: 1) }
            }
          }
          .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
          .clipShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
          sales(scale: scale)
          Text("Recent orders")
            .textStyle(.sm, weight: .semibold)
            .padding(.horizontal, 4)
            .accessibilityAddTraits(.isHeader)
          ScrollView(.horizontal, showsIndicators: false) {
            ToggleGroup(selection: filterBinding, size: .sm, spacing: 0) {
              ForEach(Self.filters, id: \.self) { item in
                ToggleGroupItem(LocalizedStringKey(item), value: item)
              }
            }
            .accessibilityLabel("Order status")
          }
          .padding(.top, -8)
          ItemGroup(.inset) {
            ForEach(Array(Self.filtered(filter ?? "All").enumerated()), id: \.element.id) { offset, order in
              if offset > 0 {
                Separator().padding(.leading, 60)
              }
              orderRow(order)
                .transition(.opacity.combined(with: .offset(y: 6)))
            }
          }
        }
        .padding(.horizontal, 16)
        .padding(.top, 4)
        .padding(.bottom, 24)
      } header: {
        Header {
          HeaderTitle("Overview")
        } trailing: {
          DropdownMenu(align: .end) {
            DropdownMenuLabel("Stores")
            DropdownMenuRadioGroup(selection: storeBinding) {
              DropdownMenuRadioItem("All stores", value: "")
              ForEach(Self.stores, id: \.self) { item in
                DropdownMenuRadioItem(LocalizedStringKey(item), value: item)
              }
            }
          } label: {
            Ph.storefront.regular
              .frame(width: 22, height: 22)
              .foregroundStyle(EsuissColor.foreground)
              .frame(width: 44, height: 44)
              .contentShape(Rectangle())
          }
          .buttonStyle(.plain)
          .accessibilityLabel(Text("Stores"))
        }
      }
    }
  }

  private func stat(_ stat: (label: String, value: String, change: String, up: Bool)) -> some View {
    VStack(alignment: .leading, spacing: 2) {
      Text(LocalizedStringKey(stat.label))
        .textStyle(.sm)
        .foregroundStyle(EsuissColor.mutedForeground)
      Text(verbatim: stat.value)
        .textStyle(.xl2, weight: .semibold)
        .monospacedDigit()
        .lineLimit(1)
        .minimumScaleFactor(0.7)
        .contentTransition(.numericText())
      Text("\(stat.change) vs. previous period")
        .textStyle(.xs)
        .foregroundStyle(stat.up ? Color.adaptive(light: Palette.green600, dark: Palette.green400) : EsuissColor.destructive)
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 14)
    .frame(maxWidth: .infinity, alignment: .leading)
    .accessibilityElement(children: .combine)
  }

  private func sales(scale: Double) -> some View {
    let keys = ["online", "store"]
    let day = active.map { Self.week[$0] }
    return VStack(alignment: .leading, spacing: 14) {
      HStack(alignment: .top, spacing: 8) {
        VStack(alignment: .leading, spacing: 0) {
          Text(LocalizedStringKey(day?.day ?? "Weekly sales"))
            .textStyle(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
          Text(verbatim: day.map { money(($0.online + $0.store) * 1000) } ?? money(1284500 * scale))
            .textStyle(.xl2, weight: .semibold)
            .monospacedDigit()
            .contentTransition(.numericText())
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
        HStack(spacing: 12) {
          ForEach(keys, id: \.self) { key in
            HStack(spacing: 5) {
              Circle()
                .fill(chartConfig.color(key))
                .frame(width: 8, height: 8)
              Text(LocalizedStringKey(chartConfig.label(key)))
            }
          }
        }
        .textStyle(.xs)
        .foregroundStyle(EsuissColor.mutedForeground)
        .accessibilityHidden(true)
      }
      ChartContainer(config: chartConfig) {
        Chart {
          ForEach(keys, id: \.self) { key in
            ForEach(Self.week.indices, id: \.self) { index in
              let item = Self.week[index]
              BarMark(x: .value("Day", item.day), y: .value("Sales", key == "online" ? item.online : item.store), width: .fixed(12))
                .position(by: .value("Channel", key), span: .fixed(27))
                .clipShape(RoundedRectangle(cornerRadius: Radius.xs, style: .continuous))
                .foregroundStyle(chartConfig.color(key).opacity(active == nil || active == index ? 1 : 0.35))
            }
          }
        }
        .chartXAxis { ChartAxis.x(values: Self.week.map(\.day)) }
        .chartYAxis { ChartAxis.grid() }
        .animation(reduceMotion ? nil : .easeOut(duration: 0.2), value: active)
        .chartTooltip(
          x: Self.week.map(\.day),
          selection: $active,
          cursor: false,
          accessibilityLabel: "Weekly sales",
          items: { index in
            [
              ChartTooltipItem("online", value: Self.week[index].online * 1000),
              ChartTooltipItem("store", value: Self.week[index].store * 1000),
            ]
          }
        ) { _ in
          EmptyView()
        }
      }
      .frame(height: 160)
    }
    .padding(.horizontal, 16)
    .padding(.top, 14)
    .padding(.bottom, 8)
    .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
  }

  private func orderRow(_ order: Order) -> some View {
    Item(size: .sm, action: { onOrderPress?(order.id) }) {
      ItemMedia {
        Text(verbatim: order.name.split(separator: " ").compactMap(\.first).map(String.init).joined())
          .scaledFont(.xs, weight: .semibold)
          .lineLimit(1)
          .minimumScaleFactor(0.5)
          .foregroundStyle(EsuissColor.primaryForeground)
          .frame(width: 32, height: 32)
          .background(order.tint, in: Circle())
          .accessibilityHidden(true)
      }
      ItemContent {
        ItemTitle(verbatim: order.name)
        ItemDescription(verbatim: "\(order.product) · \(order.id)")
      }
      ItemActions {
        VStack(alignment: .trailing, spacing: 0) {
          Text(verbatim: money(order.total))
            .textStyle(.base)
            .monospacedDigit()
            .foregroundStyle(EsuissColor.foreground)
          Text(LocalizedStringKey(order.status))
            .textStyle(.sm)
            .foregroundStyle(order.status == "Returned" ? EsuissColor.destructive : EsuissColor.mutedForeground)
        }
      }
    }
  }
}

private struct DashStoreShell<Content: View>: View {
  let onNavigate: ((String) -> Void)?
  let content: Content

  @State private var tab = "overview"

  init(onNavigate: ((String) -> Void)?, @ViewBuilder content: () -> Content) {
    self.onNavigate = onNavigate
    self.content = content()
  }

  private static var sections: [(value: String, label: LocalizedStringKey, icon: Image, active: Image, badge: TabBarBadge?)] {
    [
      ("overview", "Overview", Ph.house.regular, Ph.house.fill, nil),
      ("orders", "Orders", Ph.handbag.regular, Ph.handbag.fill, 12),
      ("customers", "Customers", Ph.users.regular, Ph.users.fill, nil),
      ("reports", "Reports", Ph.chartBar.regular, Ph.chartBar.fill, nil),
    ]
  }

  var body: some View {
    let selection = Binding<String>(
      get: { tab },
      set: { value in
        guard value != tab else { return }
        onNavigate?(value)
        tab = value
      }
    )
    Screen {
      ZStack {
        content
          .opacity(tab == "overview" ? 1 : 0)
          .allowsHitTesting(tab == "overview")
          .accessibilityHidden(tab != "overview")
        if tab != "overview" {
          Empty {
            EmptyHeader {
              EmptyDescription("This section isn't part of the sample. Choose \(Text("Overview")).")
            }
          }
          .background(EsuissColor.background)
        }
      }
      .frame(maxHeight: .infinity)
      TabBar(selection: selection) {
        ForEach(Self.sections, id: \.value) { section in
          TabBarItem(section.label, value: section.value, icon: section.icon, activeIcon: section.active, badge: section.badge)
        }
      }
    }
  }
}
