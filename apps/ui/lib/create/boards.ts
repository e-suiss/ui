export const BOARDS = [
  { name: "preview-01", title: "01" },
  { name: "preview-02", title: "02" },
] as const

export const DEFAULT_ITEM: string = BOARDS[0].name

export const isBoard = (name: string) =>
  BOARDS.some((board) => board.name === name)
