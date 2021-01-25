import type { Board } from './Board'

const PIECE_COLORS = ['cyan', 'purple', 'orange', 'yellow', 'green', 'red', 'magenta']

export function renderBoard(board: Board, context: CanvasRenderingContext2D): void {
  const canvas = context.canvas

  // Compute dimensions
  const w = canvas.width
  const h = canvas.height
  const s = Math.floor(w / 10)

  // Clear
  context.fillStyle = 'black'
  context.fillRect(0, 0, w, h)

  // Draw pieces
  for (const [x, y, cell] of board.cells()) {
    context.fillStyle = PIECE_COLORS[cell]
    context.fillRect(x * s, h - (y + 1) * s, s, s)
  }
}
