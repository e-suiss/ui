import SwiftUI

public typealias ContextMenuItem<Label: View> = DropdownMenuItem<Label>
public typealias ContextMenuCheckboxItem<Label: View> = DropdownMenuCheckboxItem<Label>
public typealias ContextMenuRadioGroup<Content: View> = DropdownMenuRadioGroup<Content>
public typealias ContextMenuRadioItem<Label: View> = DropdownMenuRadioItem<Label>
public typealias ContextMenuLabel = DropdownMenuLabel
public typealias ContextMenuGroup<Content: View> = DropdownMenuGroup<Content>
public typealias ContextMenuSeparator = DropdownMenuSeparator
public typealias ContextMenuSub<Label: View, Content: View> = DropdownMenuSub<Label, Content>

extension View {
  public func contextMenu<Items: View, Preview: View>(
    @ViewBuilder items: () -> Items,
    @ViewBuilder preview: () -> Preview,
    previewRadius: CGFloat
  ) -> some View {
    contentShape(.contextMenuPreview, RoundedRectangle(cornerRadius: previewRadius, style: .continuous))
      .contextMenu(menuItems: items, preview: preview)
  }

  public func contextMenu<Items: View>(
    previewRadius: CGFloat,
    @ViewBuilder items: () -> Items
  ) -> some View {
    contentShape(.contextMenuPreview, RoundedRectangle(cornerRadius: previewRadius, style: .continuous))
      .contextMenu(menuItems: items)
  }
}
