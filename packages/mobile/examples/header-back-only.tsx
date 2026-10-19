import { Header, HeaderBack, HeaderTitle } from "@/components/ui/header"

export default function HeaderBackOnly() {
  return (
    <Header className="-mx-4 -mt-4">
      <HeaderBack>A very long previous screen title</HeaderBack>
      <HeaderTitle>Details</HeaderTitle>
    </Header>
  )
}
