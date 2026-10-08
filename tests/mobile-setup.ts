import { page } from "vitest/browser"

const DEVICE = navigator.userAgent.includes("iPhone")
  ? { width: 393, height: 659 }
  : { width: 412, height: 839 }

const device = page as typeof page & { resizeToDevice?: typeof page.viewport }

if (!device.resizeToDevice) {
  const resize = page.viewport
  device.resizeToDevice = resize
  page.viewport = function (this: typeof page) {
    return resize.call(this, DEVICE.width, DEVICE.height)
  }
}
