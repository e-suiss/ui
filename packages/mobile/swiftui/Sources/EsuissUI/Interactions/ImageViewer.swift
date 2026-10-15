import PhosphorSwift
import SwiftUI

enum ImageViewerMath {
  static let minScale: CGFloat = 1
  static let maxScale: CGFloat = 4
  static let doubleTapScale: CGFloat = 2.5
  static let dismissDistance: CGFloat = 120
  static let fadeDistance: CGFloat = 300

  static func clampScale(_ scale: CGFloat) -> CGFloat {
    min(max(scale, minScale), maxScale)
  }

  static func clampOffset(_ offset: CGSize, scale: CGFloat, size: CGSize) -> CGSize {
    let limitX = max(0, (size.width * scale - size.width) / 2)
    let limitY = max(0, (size.height * scale - size.height) / 2)
    return CGSize(
      width: min(max(offset.width, -limitX), limitX),
      height: min(max(offset.height, -limitY), limitY)
    )
  }

  static func doubleTap(scale: CGFloat, location: CGPoint, size: CGSize) -> (scale: CGFloat, offset: CGSize) {
    guard scale <= minScale else { return (minScale, .zero) }
    let target = doubleTapScale
    let offset = CGSize(
      width: (size.width / 2 - location.x) * (target - 1),
      height: (size.height / 2 - location.y) * (target - 1)
    )
    return (target, clampOffset(offset, scale: target, size: size))
  }

  static func page(current: Int, translation: CGFloat, predicted: CGFloat, width: CGFloat, count: Int) -> Int {
    guard count > 0, width > 0 else { return 0 }
    var next = current
    if translation < -width * 0.25 || predicted < -width * 0.5 {
      next = current + 1
    } else if translation > width * 0.25 || predicted > width * 0.5 {
      next = current - 1
    }
    return min(max(next, 0), count - 1)
  }

  static func resisted(_ translation: CGFloat, current: Int, count: Int) -> CGFloat {
    let atStart = current == 0 && translation > 0
    let atEnd = current >= count - 1 && translation < 0
    return atStart || atEnd ? translation / 3 : translation
  }

  static func backdropOpacity(_ translation: CGFloat) -> Double {
    Double(max(0, 1 - abs(translation) / fadeDistance))
  }

  static func shouldDismiss(translation: CGFloat, predicted: CGFloat) -> Bool {
    abs(translation) > dismissDistance || abs(predicted) > dismissDistance * 2.5
  }
}

extension View {
  public func imageViewer(
    isPresented: Binding<Bool>,
    images: [Image],
    index: Binding<Int>
  ) -> some View {
    modifier(
      CoverPresenter(isPresented: isPresented, enter: .easeOut(duration: 0.2), exit: .easeIn(duration: 0.2)) { visible in
        ImageViewer(images: images, index: index)
          .opacity(visible ? 1 : 0)
          .scaleEffect(visible ? 1 : 0.96)
      }
    )
  }
}

public struct ImageViewer: View {
  let images: [Image]
  let index: Binding<Int>

  @State private var scale: CGFloat = 1
  @State private var offset: CGSize = .zero
  @State private var pinchStart: CGFloat?
  @State private var panStart: CGSize?
  @State private var drag: CGSize = .zero
  @State private var axis: Axis?
  @State private var dismissing = false
  @Environment(\.overlayDismiss) private var dismiss
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(images: [Image], index: Binding<Int>) {
    self.images = images
    self.index = index
  }

  public var body: some View {
    GeometryReader { proxy in
      let size = proxy.size
      let count = images.count
      let current = CarouselMath.clamp(index.wrappedValue, count: count)
      let fade = axis == .vertical || dismissing ? ImageViewerMath.backdropOpacity(drag.height) : 1
      ZStack {
        EsuissColor.background
          .opacity(fade)
          .ignoresSafeArea()
        HStack(spacing: 0) {
          ForEach(images.indices, id: \.self) { page in
            images[page]
              .resizable()
              .scaledToFit()
              .frame(width: size.width, height: size.height)
              .scaleEffect(page == current ? scale : 1)
              .offset(page == current ? offset : .zero)
              .accessibilityHidden(page != current)
          }
        }
        .frame(width: size.width, height: size.height, alignment: .leading)
        .offset(
          x: -CGFloat(current) * size.width + (axis == .horizontal ? drag.width : 0),
          y: axis == .vertical || dismissing ? drag.height : 0
        )
        .contentShape(Rectangle())
        .gesture(dragGesture(size: size, current: current, count: count))
        .simultaneousGesture(magnifyGesture(size: size))
        .onTapGesture(count: 2, coordinateSpace: .local) { location in
          let result = ImageViewerMath.doubleTap(scale: scale, location: location, size: size)
          withAnimation(animation) {
            scale = result.scale
            offset = result.offset
          }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text("Image \(current + 1) of \(count)"))
        .accessibilityAddTraits(.isImage)
        .accessibilityAdjustableAction { direction in
          switch direction {
          case .increment: if current < count - 1 { index.wrappedValue = current + 1 }
          case .decrement: if current > 0 { index.wrappedValue = current - 1 }
          @unknown default: break
          }
        }
        VStack {
          ZStack {
            Text("\(current + 1) of \(count)")
              .scaledFont(.base, weight: .semibold)
              .monospacedDigit()
              .foregroundStyle(EsuissColor.foreground)
            HStack {
              Spacer()
              Button {
                dismiss?()
              } label: {
                Ph.x.bold.frame(width: 16, height: 16)
              }
              .buttonStyle(.variant(.secondary, size: .icon))
              .accessibilityLabel(Text("Close"))
            }
          }
          .padding(.horizontal, 16)
          .frame(height: 44)
          Spacer()
        }
        .opacity(fade)
      }
      .clipped()
    }
    .onChange(of: index.wrappedValue) { _, _ in
      scale = 1
      offset = .zero
    }
    .accessibilityAddTraits(.isModal)
    .accessibilityAction(.escape) { dismiss?() }
    .environment(\.colorScheme, .dark)
  }

  private var animation: Animation? {
    reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.35)
  }

  private func dragGesture(size: CGSize, current: Int, count: Int) -> some Gesture {
    DragGesture(minimumDistance: 10)
      .onChanged { value in
        if scale > 1 {
          let start = panStart ?? offset
          panStart = start
          offset = ImageViewerMath.clampOffset(
            CGSize(width: start.width + value.translation.width, height: start.height + value.translation.height),
            scale: scale,
            size: size
          )
          return
        }
        if axis == nil {
          axis = abs(value.translation.width) > abs(value.translation.height) ? .horizontal : .vertical
        }
        drag = CGSize(
          width: ImageViewerMath.resisted(value.translation.width, current: current, count: count),
          height: value.translation.height
        )
      }
      .onEnded { value in
        panStart = nil
        guard scale <= 1 else { return }
        if axis == .horizontal {
          let target = ImageViewerMath.page(
            current: current,
            translation: value.translation.width,
            predicted: value.predictedEndTranslation.width,
            width: size.width,
            count: count
          )
          withAnimation(animation) {
            index.wrappedValue = target
            drag = .zero
          } completion: {
            axis = nil
          }
        } else if axis == .vertical {
          if ImageViewerMath.shouldDismiss(translation: value.translation.height, predicted: value.predictedEndTranslation.height) {
            dismissing = true
            axis = nil
            dismiss?()
          } else {
            withAnimation(animation) {
              drag = .zero
            } completion: {
              axis = nil
            }
          }
        }
      }
  }

  private func magnifyGesture(size: CGSize) -> some Gesture {
    MagnifyGesture()
      .onChanged { value in
        let start = pinchStart ?? scale
        pinchStart = start
        scale = ImageViewerMath.clampScale(start * value.magnification)
        offset = ImageViewerMath.clampOffset(offset, scale: scale, size: size)
      }
      .onEnded { _ in
        pinchStart = nil
        if scale <= 1.01 {
          withAnimation(animation) {
            scale = 1
            offset = .zero
          }
        }
      }
  }
}
