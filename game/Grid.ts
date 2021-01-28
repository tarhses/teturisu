// @ts-ignore: file extension (deno compat)
import { Piece, PieceType } from './Piece.ts'

export const WIDTH = 10
export const HEIGHT = 20
const ACTUAL_HEIGHT = 25

export interface Line {
  y: number
  cells: number[]
}

export class Grid {
  #cells: number[][] = []

  public constructor() {
    for (let y = 0; y < ACTUAL_HEIGHT; y++) {
      this.#cells.push(newLine())
    }
  }

  public *[Symbol.iterator](): Generator<[number, number, PieceType], void, void> {
    for (let y = 0; y < ACTUAL_HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const cell = this.#cells[y][x]
        if (cell > 0) {
          yield [x, y, cell - 1]
        }
      }
    }
  }

  public hasCell(x: number, y: number): boolean {
    return this.#cells[y][x] > 0
  }

  public renderPiece(piece: Piece): void {
    const cell = piece.type + 1
    for (const [x, y] of piece) {
      this.#cells[y][x] = cell
    }
  }

  public erasePiece(piece: Piece): void {
    for (const [x, y] of piece) {
      this.#cells[y][x] = 0
    }
  }

  public renderLines(lines: Line[]): void {
    for (const line of lines) {
      this.#cells.splice(line.y, 0, line.cells)
      this.#cells.pop()
    }
  }

  public eraseLines(): Line[] {
    const cleared = this.#cells
      .map((cells, y) => ({ y, cells }))
      .filter(line => line.cells.every(cell => cell > 0))

    for (let i = cleared.length - 1; i >= 0; i--) {
      const line = cleared[i]
      this.#cells.splice(line.y, 1)
      this.#cells.push(newLine())
    }

    return cleared
  }
}

function newLine(): number[] {
  const line: number[] = []
  for (let x = 0; x < WIDTH; x++) {
    line.push(0)
  }

  return line
}
