// swift-tools-version: 6.0
import PackageDescription

let package = Package(
  name: "EsuissUI",
  platforms: [.iOS(.v17)],
  products: [
    .library(name: "EsuissUI", targets: ["EsuissUI"])
  ],
  dependencies: [
    .package(url: "https://github.com/phosphor-icons/swift", from: "2.1.0")
  ],
  targets: [
    .target(
      name: "EsuissUI",
      dependencies: [.product(name: "PhosphorSwift", package: "swift")],
      path: "Sources/EsuissUI"
    ),
    .testTarget(
      name: "EsuissUITests",
      dependencies: ["EsuissUI", .product(name: "PhosphorSwift", package: "swift")],
      path: "Tests/EsuissUITests"
    ),
  ]
)
