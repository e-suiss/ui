import SwiftUI

enum PagedListMath {
  static func pageCount(total: Int, pageSize: Int) -> Int {
    max(1, Int((Double(total) / Double(max(pageSize, 1))).rounded(.up)))
  }

  static func visibleCount(loaded: Int, pageSize: Int, total: Int) -> Int {
    min(loaded * max(pageSize, 1), total)
  }

  static func shouldLoad(appearing index: Int, visible: Int, total: Int) -> Bool {
    index == visible - 1 && visible < total
  }
}

public struct PagedList<Item, ID: Hashable, Row: View>: View {
  let items: [Item]
  let id: KeyPath<Item, ID>
  let pageSize: Int
  let loadMoreLabel: LocalizedStringKey?
  let loadsOnEndReached: Bool
  let row: (Item, Int) -> Row

  @State private var loaded = 1

  public init(
    _ items: [Item],
    id: KeyPath<Item, ID>,
    pageSize: Int = 10,
    loadMoreLabel: LocalizedStringKey? = "Load more",
    loadsOnEndReached: Bool = true,
    @ViewBuilder row: @escaping (Item, Int) -> Row
  ) {
    self.items = items
    self.loadsOnEndReached = loadsOnEndReached
    self.id = id
    self.pageSize = pageSize
    self.loadMoreLabel = loadMoreLabel
    self.row = row
  }

  public var body: some View {
    let visible = PagedListMath.visibleCount(loaded: loaded, pageSize: pageSize, total: items.count)
    VStack(spacing: 16) {
      LazyVStack(alignment: .leading, spacing: 0) {
        ForEach(0..<visible, id: \.self) { index in
          row(items[index], index)
            .id(items[index][keyPath: id])
            .onAppear {
              if loadsOnEndReached, PagedListMath.shouldLoad(appearing: index, visible: visible, total: items.count) {
                loadMore()
              }
            }
        }
      }
      if visible < items.count, let loadMoreLabel {
        Button(action: loadMore) {
          Text(loadMoreLabel)
        }
        .buttonStyle(.variant(.secondary, size: .lg, block: true))
      }
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }

  private func loadMore() {
    let pages = PagedListMath.pageCount(total: items.count, pageSize: pageSize)
    loaded = min(loaded + 1, pages)
  }
}

extension PagedList where Item: Identifiable, ID == Item.ID {
  public init(
    _ items: [Item],
    pageSize: Int = 10,
    loadMoreLabel: LocalizedStringKey? = "Load more",
    loadsOnEndReached: Bool = true,
    @ViewBuilder row: @escaping (Item, Int) -> Row
  ) {
    self.init(items, id: \.id, pageSize: pageSize, loadMoreLabel: loadMoreLabel, loadsOnEndReached: loadsOnEndReached, row: row)
  }
}
