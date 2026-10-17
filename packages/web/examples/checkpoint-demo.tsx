"use client"

import * as React from "react"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Message, MessageContent } from "@/components/ui/message"

type Turn = {
  id: string
  role: "user" | "assistant"
  text: string
  checkpoint?: string
}

const transcript: Turn[] = [
  { id: "1", role: "user", text: "Rename the button component to action." },
  {
    id: "2",
    role: "assistant",
    text: "Renamed Button to Action in components/ui/button.tsx.",
    checkpoint: "Button renamed",
  },
  { id: "3", role: "user", text: "Update the docs to match." },
  {
    id: "4",
    role: "assistant",
    text: "Updated the Button page to say Action.",
  },
]

export default function CheckpointDemo() {
  const [turns, setTurns] = React.useState(transcript)

  return (
    <div className="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      {turns.map((turn, index) => (
        <React.Fragment key={turn.id}>
          {turn.role === "user" ? (
            <Message align="end">
              <MessageContent>
                <Bubble align="end" variant="muted">
                  <BubbleContent>{turn.text}</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          ) : (
            <Message>
              <MessageContent>
                <p>{turn.text}</p>
              </MessageContent>
            </Message>
          )}
          {turn.checkpoint && (
            <Marker variant="separator">
              <MarkerContent className="inline-flex items-center gap-2">
                {turn.checkpoint}
                {index < turns.length - 1 && (
                  <Button
                    size="xs"
                    variant="outline"
                    aria-label={`Restore to ${turn.checkpoint}`}
                    onClick={() => setTurns(turns.slice(0, index + 1))}
                  >
                    Restore
                  </Button>
                )}
              </MarkerContent>
            </Marker>
          )}
        </React.Fragment>
      ))}
      {turns.length < transcript.length && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onClick={() => setTurns(transcript)}
        >
          Reset
        </Button>
      )}
    </div>
  )
}
