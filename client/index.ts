import { TICK_FRAMERATE } from '../game/constants'
import { Game, Move } from '../game/Game'

const COLORS = ['black', 'cyan', 'purple', 'orange', 'yellow', 'green', 'red', 'magenta']

// DOM elements
// @ts-ignore: will always be a canvas (otherwise we're in trouble)
const canvas: HTMLCanvasElement = document.getElementById('canvas')
const context = canvas.getContext('2d')

// Game state
const game = new Game()

// Main
document.addEventListener('keydown', e => {
  const move = handleKeyDown(e.code)
  if (move !== null) {
    game.handleMove(move)
  }
})

document.addEventListener('keyup', e => {
  const move = handleKeyUp(e.code)
  if (move !== null) {
    game.handleMove(move)
  }
})

const firstFrame = performance.now()
let lastFrame = firstFrame
handleFrame(firstFrame)

function handleFrame(t: number) {
  requestAnimationFrame(handleFrame)

  while (t - lastFrame >= TICK_FRAMERATE) {
    game.handleTick()
    lastFrame += TICK_FRAMERATE
  }

  context.clearRect(0, 0, 800, 600)
  for (const [x, y, cell] of game.cells()) {
    context.fillStyle = COLORS[cell]
    context.fillRect(x * 16, (20.5 - y) * 16, 15, 15)
  }
}

function handleKeyDown(code: string): Move | null {
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

function handleKeyUp(code: string): Move | null {
  switch (code) {
    case 'ArrowDown': return Move.STOP_SOFT_DROP
    default: return null
  }
}
