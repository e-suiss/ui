import { expect, test } from "vitest"
import AvatarFallbackExample from "@/examples/avatar-fallback"
import AvatarGroupExample from "@/examples/avatar-group"
import { renderExample } from "@/tests/render-example"

const people = [
  {
    name: "Emma Wilson",
    initials: "EW",
    src: "https://i.pravatar.cc/128?img=47",
  },
  {
    name: "Liam Carter",
    initials: "LC",
    src: "https://i.pravatar.cc/128?img=12",
  },
  {
    name: "Sofia Martinez",
    initials: "SM",
    src: "https://i.pravatar.cc/128?img=32",
  },
] as const

test("Fallback", async () => {
  const { canvas } = await renderExample(<AvatarFallbackExample />)

  await expect(canvas.getByText("LC")).toBeVisible()
})
test("Group", async () => {
  const { canvas } = await renderExample(<AvatarGroupExample />)

  await expect(canvas.getByText("+4")).toBeVisible()
  for (const person of people) {
    await expect(
      canvas.queryByRole("img", { name: person.name }) ??
        canvas.queryByText(person.initials)
    ).toBeInTheDocument()
  }
})
