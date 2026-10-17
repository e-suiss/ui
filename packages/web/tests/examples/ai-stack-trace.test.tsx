import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import StackTraceDemo from "@/examples/stack-trace-demo"
import StackTraceFrames from "@/examples/stack-trace-frames"
import { renderExample } from "@/tests/render-example"

const FAILED = /Failed: TypeError/
const FRAMEWORK_FRAMES = /framework frames/
const SEED_USERS = /seedUsers in prisma\/seed\.ts:27/
const FORMAT_INVOICE = /formatInvoice in app\/lib\/billing\.ts:42/
const WORK_LOOP = /workLoopSync/

test("Default", async () => {
  const { canvas, step } = await renderExample(<StackTraceDemo />)

  await step("opens the failed command as an error", async () => {
    const failed = canvas.getByRole("button", { name: FAILED })
    await expect(failed).toHaveAttribute("aria-expanded", "true")
    await expect(
      failed.querySelector('[data-slot="trace-line"]')
    ).toHaveAttribute("data-status", "error")
  })

  await step("links the app frames", async () => {
    await expect(
      canvas.getByRole("link", { name: SEED_USERS })
    ).toHaveAttribute("href", "#prisma/seed.ts:27")
  })
})
test("Frames", async () => {
  const { canvas, step } = await renderExample(<StackTraceFrames />)

  await step("links each app frame", async () => {
    await expect(
      canvas.getByRole("link", { name: FORMAT_INVOICE })
    ).toBeVisible()
  })

  await step("hides the framework frames until expanded", async () => {
    const frames = canvas.getByRole("button", { name: FRAMEWORK_FRAMES })
    await expect(frames).toHaveAttribute("aria-expanded", "false")
    await expect(canvas.queryByText(WORK_LOOP)).toBeNull()
    await userEvent.click(frames)
    await expect(frames).toHaveAttribute("aria-expanded", "true")
    await expect(await canvas.findByText(WORK_LOOP)).toBeVisible()
  })
})
