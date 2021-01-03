import { Move } from '../game/protocol'

export const PIECE_COLORS = ['black', 'cyan', 'purple', 'orange', 'yellow', 'green', 'red', 'magenta']

export function getKeyDown(code: string): Move | null {
  switch (code) {
    case 'ArrowDown': return Move.START_SOFT_DROP
    case 'Space': return Move.HARD_DROP
    case 'ArrowLeft': return Move.LEFT_SHIFT
    case 'ArrowRight': return Move.RIGHT_SHIFT
    case 'KeyZ': return Move.LEFT_ROTATION
    case 'KeyX': return Move.RIGHT_ROTATION
    default: return null
  }
}

export function getKeyUp(code: string): Move | null {
  switch (code) {
    case 'ArrowDown': return Move.STOP_SOFT_DROP
    default: return null
  }
}
