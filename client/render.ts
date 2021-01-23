import type { Board } from './Board'

const PIECE_COLORS = ['black', 'cyan', 'purple', 'orange', 'yellow', 'green', 'red', 'magenta']

export function renderBoard(board: Board, context: CanvasRenderingContext2D): void {
  const canvas = context.canvas

  // Compute dimensions
  const w = canvas.width
  const h = canvas.height
  const pw = Math.floor(w / 10)
  const ph = Math.floor(h / 20)

  // Clear
  context.fillStyle = 'black'
  context.fillRect(0, 0, w, h)

  // Draw pieces
  for (const [x, y, cell] of board.cells()) {
    context.fillStyle = PIECE_COLORS[cell]
    context.fillRect(x * pw, (19 - y) * ph, pw, ph)
  }
}
