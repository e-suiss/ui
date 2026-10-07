import "../styles/globals.css"

import { beforeEach } from "vitest"
import { cdp } from "vitest/browser"

beforeEach(async () => {
  await cdp().send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: window.innerWidth - 1,
    y: window.innerHeight - 1,
  })
})
