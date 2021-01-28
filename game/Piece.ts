// @ts-ignore: file extension (deno compat)
import { Grid, WIDTH, HEIGHT } from './Grid.ts'

export enum PieceType { I, J, L, O, S, T, Z }

type Model = number[][]
type WallKicks = [number, number][]

export class Piece {
  #grid: Grid
  #type: PieceType
  #x: number
  #y: number = 22
  #r: number = 0

  public constructor(grid: Grid, type: PieceType) {
    this.#grid = grid
    this.#type = type
    this.#x = Math.floor((WIDTH - this.model.length) / 2)
  }

  public get type(): PieceType {
    return this.#type
  }

  private get model(): Model {
    return MODELS[this.#type]
  }

  public *[Symbol.iterator](): Generator<[number, number], void, void> {
    for (const [x, y] of iterModelCells(this.model, this.#r)) {
      yield [this.#x + x, this.#y - y]
    }
  }

  public get visible(): boolean {
    return Array.from(this).some(([_, y]) => y < HEIGHT)
  }

  public get overlapping(): boolean {
    return Array.from(this).some(([x, y]) => this.#grid.hasCell(x, y))
  }

  public shift(dx: number, dy: number): boolean {
    this.#x += dx
    this.#y += dy

    const success = !this.overlapping
    if (!success) {
      this.#x -= dx
      this.#y -= dy
    }

    return success
  }

  public rotate(dr: number): boolean {
    const r = this.#r
    this.#r = (this.#r + dr) & 3 // binary AND to stay within bounds

    const kicks = getWallKicks(this.#type, dr > 0)[this.#r]
    for (const [dx, dy] of kicks) {
      if (this.shift(dx, dy)) {
        return true
      }
    }

    this.#r = r
    return false
  }

  public render(): void {
    this.#grid.renderPiece(this)
  }

  public erase(): void {
    this.#grid.erasePiece(this)
  }
}

function *iterModelCells(model: Model, r: number): Generator<[number, number], void, void> {
  const size = model.length
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = getModelCell(model, x, y, r)
      if (cell > 0) {
        yield [x, y]
      }
    }
  }
}

function getModelCell(model: Model, x: number, y: number, r: number): number {
  const last = model.length - 1
  switch (r) {
    case 0: return model[y][x]
    case 1: return model[last - x][y]
    case 2: return model[last - y][last - x]
    case 3: return model[x][last - y]
    default: throw new RangeError()
  }
}

function getWallKicks(type: number, clockwise: boolean): WallKicks[] {
  switch (type) {
    case PieceType.I: return clockwise ? KICKS_CLOCKWISE_I : KICKS_COUNTERCLOCKWISE_I
    case PieceType.O: return KICKS_O
    default: return clockwise ? KICKS_CLOCKWISE_JLSTZ : KICKS_COUNTERCLOCKWISE_JLSTZ
  }
}

const MODELS: Model[] = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  [
    [4, 4],
    [4, 4],
  ],
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
]

const KICKS_CLOCKWISE_I: WallKicks[] = [
  [[ 0, 0], [-2, 0], [ 1, 0], [-2,-1], [ 1, 2]],
  [[ 0, 0], [-1, 0], [ 2, 0], [-1, 2], [ 2,-1]],
  [[ 0, 0], [ 2, 0], [-1, 0], [ 2, 1], [-1,-2]],
  [[ 0, 0], [ 1, 0], [-2, 0], [ 1,-2], [-2, 1]],
]

const KICKS_COUNTERCLOCKWISE_I: WallKicks[] = [
  [[ 0, 0], [-1, 0], [ 2, 0], [-1, 2], [ 2,-1]],
  [[ 0, 0], [-2, 0], [ 1, 0], [-2,-1], [ 1, 2]],
  [[ 0, 0], [ 1, 0], [-2, 0], [ 1,-2], [-2, 1]],
  [[ 0, 0], [ 2, 0], [-1, 0], [ 2, 1], [-1,-2]],
]

const KICKS_CLOCKWISE_JLSTZ: WallKicks[] = [
  [[ 0, 0], [-1, 0], [-1, 1], [ 0,-2], [-1,-2]],
  [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]],
  [[ 0, 0], [ 1, 0], [ 1, 1], [ 0,-2], [ 1,-2]],
  [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]],
]

const KICKS_COUNTERCLOCKWISE_JLSTZ: WallKicks[] = [
  [[ 0, 0], [ 1, 0], [ 1, 1], [ 0,-2], [ 1,-2]],
  [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]],
  [[ 0, 0], [-1, 0], [-1, 1], [ 0,-2], [-1,-2]],
  [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]],
]

const KICKS_O: WallKicks[] = [
  [[ 0, 0]],
  [[ 0, 0]],
  [[ 0, 0]],
  [[ 0, 0]],
]
