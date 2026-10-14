import SwiftUI
import XCTest

@testable import EsuissUI

@MainActor
private final class HapticsProbeBox {
  var values: [Bool] = []
}

private struct HapticsProbe: View {
  let box: HapticsProbeBox

  @Environment(\.hapticsEnabled) private var enabled

  var body: some View {
    box.values.append(enabled)
    return Color.clear.frame(width: 1, height: 1)
  }
}

@MainActor
final class HapticsTests: XCTestCase {
  func testHapticsEnabledDefaultsToTrueAndModifierOverrides() {
    let box = HapticsProbeBox()
    _ = ImageRenderer(content: HapticsProbe(box: box)).uiImage
    XCTAssertEqual(box.values.last, true)

    let off = HapticsProbeBox()
    _ = ImageRenderer(content: HapticsProbe(box: off).haptics(false)).uiImage
    XCTAssertEqual(off.values.last, false)

    let nested = HapticsProbeBox()
    _ = ImageRenderer(content: VStack { HapticsProbe(box: nested).haptics(true) }.haptics(false)).uiImage
    XCTAssertEqual(nested.values.last, true)
  }

  func testSliderStepTriggerChangesOnlyAcrossSteps() {
    let bounds = 0.0...10.0
    XCTAssertEqual(HapticMoments.step(2.0, bounds: bounds, step: 1), 2)
    XCTAssertEqual(HapticMoments.step(2.0, bounds: bounds, step: 1), HapticMoments.step(2.4, bounds: bounds, step: 1))
    XCTAssertNotEqual(HapticMoments.step(2.0, bounds: bounds, step: 1), HapticMoments.step(3.0, bounds: bounds, step: 1))
    XCTAssertEqual(HapticMoments.step(5.0, bounds: 4.0...10.0, step: 0.5), 2)
    XCTAssertNil(HapticMoments.step(2.0, bounds: bounds, step: nil))
    XCTAssertNil(HapticMoments.step(2.0, bounds: bounds, step: 0))
  }

  func testThresholdLiftAndMoveConditions() {
    XCTAssertTrue(HapticMoments.crossed(nil, HorizontalEdge.trailing))
    XCTAssertFalse(HapticMoments.crossed(HorizontalEdge.trailing, nil))
    XCTAssertFalse(HapticMoments.crossed(HorizontalEdge.leading, HorizontalEdge.trailing))
    XCTAssertFalse(HapticMoments.crossed(Optional<HorizontalEdge>.none, nil))

    XCTAssertTrue(HapticMoments.lifted(nil, "a"))
    XCTAssertTrue(HapticMoments.lifted("a", "b"))
    XCTAssertFalse(HapticMoments.lifted("a", "a"))
    XCTAssertFalse(HapticMoments.lifted("a", nil))

    XCTAssertTrue(HapticMoments.moved(1, 2))
    XCTAssertFalse(HapticMoments.moved(2, 2))
    XCTAssertFalse(HapticMoments.moved(nil, 2))
    XCTAssertFalse(HapticMoments.moved(2, nil))
  }

  func testReorderSlotTargetChangesPerSlot() {
    let heights: [CGFloat] = [44, 44, 44, 44]
    let slots = [0, 10, 23, 50, 70, 90, 120].map { ReorderMath.target(from: 0, translation: $0, heights: heights) }
    var changes = 0
    for (old, new) in zip(slots, slots.dropFirst()) where HapticMoments.moved(old, new) {
      changes += 1
    }
    XCTAssertEqual(slots, [0, 0, 1, 1, 2, 2, 3])
    XCTAssertEqual(changes, 3)
  }
}
