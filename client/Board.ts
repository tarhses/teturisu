import type { Input, Move, Player } from '../game/protocol'
import { Game } from '../game/Game'

export class Board {
  #name: string
  #game: Game

  public constructor(seed: number, player: Player) {
    this.#name = player.name
    this.#game = new Game(seed)

    this.handleInputs(player.inputs)
    while (this.#game.frame < player.frame) {
      this.handleTick()
    }
  }

  public get name(): string {
    return this.#name
  }

  public set name(name: string) {
    this.#name = name
  }

  public get score(): number {
    return this.#game.score
  }

  public get level(): number {
    return this.#game.level
  }

  public get nextPiece(): number {
    return this.#game.nextPiece
  }

  public get frame(): number {
    return this.#game.frame
  }

  public handleInputs(inputs: Input[]): void {
    for (const input of inputs) {
      this.handleInput(input)
    }
  }

  public handleInput([move, frame]: Input): void {
    this.handleMove(move, frame)
  }

  public handleMove(move: Move, frame?: number): void {
    this.#game.handleMove(move, frame)
  }

  public handleTick(): void {
    this.#game.handleTick()
  }

  public cells(): Generator<[number, number, number], void, void> {
    return this.#game.cells()
  }
}
