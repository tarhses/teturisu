// @ts-ignore: file extension (deno compat)
import type { PieceType } from './Piece.ts'
// @ts-ignore: file extension (deno compat)
import { Rng } from './Rng.ts'

export class Bag {
  #rng: Rng
  #pieces: PieceType[] = []

  public constructor(seed?: number) {
    this.#rng = new Rng(seed)
  }

  public take(): PieceType {
    if (this.#pieces.length === 0) {
      this.generate()
    }

    // @ts-ignore: code above ensure that it wont be empty
    return this.#pieces.shift()
  }

  public putBack(type: PieceType): void {
    this.#pieces.unshift(type)
  }

  public peek(n: number): PieceType[] {
    while (this.#pieces.length < n) {
      this.generate()
    }

    return this.#pieces.slice(0, n)
  }

  private generate(): void {
    const bag = [0, 1, 2, 3, 4, 5, 6]
    for (let i = 0; i < 7; ++i) {
      const id = this.#rng.next(0, 6 - i)
      const piece = bag.splice(id, 1)[0]
      this.#pieces.push(piece)
    }
  }
}
