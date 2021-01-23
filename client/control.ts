import { Move } from '../game/protocol'

export type KeyHandler = (code: string) => Move | null

export function down(code: string): Move | null {
  switch (code) {
    case 'ArrowLeft':
      return Move.LEFT_SHIFT

    case 'ArrowRight':
      return Move.RIGHT_SHIFT

    case 'ControlLeft':
    case 'KeyZ':
      return Move.LEFT_ROTATION

    case 'ArrowUp':
    case 'KeyX':
      return Move.RIGHT_ROTATION

    case 'Space':
      return Move.HARD_DROP

    case 'ArrowDown':
      return Move.START_SOFT_DROP

    default:
      return null
  }
}

export function up(code: string): Move | null {
  switch (code) {
    case 'ArrowDown':
      return Move.STOP_SOFT_DROP

    default:
      return null
  }
}
