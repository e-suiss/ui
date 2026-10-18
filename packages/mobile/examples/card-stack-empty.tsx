import {
  CardStack,
  CardStackActions,
  CardStackEmpty,
  CardStackSwipeButton,
  CardStackUndo,
} from "@/components/interactions/card-stack"

type Place = { id: string; name: string; city: string; detail: string }

export default function CardStackEmptyExample() {
  return (
    <CardStack data={[] as Place[]} renderItem={() => null}>
      <CardStackEmpty>You have seen every place.</CardStackEmpty>
      <CardStackActions>
        <CardStackSwipeButton direction="left" />
        <CardStackUndo />
        <CardStackSwipeButton direction="right" />
      </CardStackActions>
    </CardStack>
  )
}
