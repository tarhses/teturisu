import type { Game } from '../game/Game'

const COLORS = ['cyan', 'purple', 'orange', 'yellow', 'green', 'red', 'magenta']
const OVER_COLOR = 'grey'

export class Renderer {
  #game: Game
  #canvas: HTMLCanvasElement
  #context: CanvasRenderingContext2D

  public constructor(game: Game, context: CanvasRenderingContext2D) {
    this.#game = game
    this.#canvas = context.canvas
    this.#context = context
  }

  public render(): void {
    const w = this.#canvas.width
    const h = this.#canvas.height
    const size = Math.floor(h / 20)

    this.#context.fillStyle = 'black'
    this.#context.fillRect(0, 0, w, h)

    for (const [x, y, cell] of this.#game) {
      this.#context.fillStyle = this.#game.over ? OVER_COLOR : COLORS[cell]
      this.#context.fillRect(x * size, h - (y + 1) * size, size - 1, size - 1)
    }
  }
}
