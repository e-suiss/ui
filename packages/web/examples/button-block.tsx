import { Button } from "@/components/ui/button"

export default function ButtonBlock() {
  return (
    <div className="flex w-80 flex-col gap-3">
      <Button block size="xs">
        Add to Bag
      </Button>
      <Button block size="sm">
        Add to Bag
      </Button>
      <Button block>Add to Bag</Button>
      <Button block size="lg">
        Add to Bag
      </Button>
      <Button block size="xl">
        Add to Bag
      </Button>
      <Button block variant="secondary">
        Continue
      </Button>
    </div>
  )
}
