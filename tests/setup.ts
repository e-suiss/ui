import "../styles/globals.css"

import { beforeEach } from "vitest"
import { cdp, page, server, userEvent } from "vitest/browser"

async function parkPointer() {
  if (server.browser === "chromium") {
    await cdp().send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: window.innerWidth - 1,
      y: window.innerHeight - 1,
    })
    return
  }
  const corner = document.createElement("div")
  corner.dataset.testid = "pointer-park"
  corner.style.cssText =
    "position:fixed;right:0;bottom:0;width:2px;height:2px;z-index:2147483647"
  document.body.append(corner)
  await userEvent.hover(page.getByTestId("pointer-park"), { force: true })
  corner.remove()
}

beforeEach(parkPointer)
