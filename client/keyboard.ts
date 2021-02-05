import { Move } from '../game/protocol'

export type KeyHandler = (code: string) => Move | undefined

export function keyDown(code: string): Move | undefined {
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
      return Move.SOFT_DROP_START

    default:
      return undefined
  }
}

export function keyUp(code: string): Move | undefined {
  switch (code) {
    case 'ArrowDown':
      return Move.SOFT_DROP_END

    default:
      return undefined
  }
}
