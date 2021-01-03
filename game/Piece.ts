// @ts-ignore: file extension (deno compat)
import { GRID_HEIGHT, GRID_WIDTH, PIECES, WALL_KICKS_CLOCKWISE_I, WALL_KICKS_CLOCKWISE_JLSTZ, WALL_KICKS_COUNTERCLOCKWISE_I, WALL_KICKS_COUNTERCLOCKWISE_JLSTZ, WALL_KICKS_O } from './constants.ts'
// @ts-ignore: file extension (deno compat)
import { Grid } from './Grid.ts'

export class Piece {
  #grid: Grid
  #type: number
  #x: number
  #y = 22
  #r = 0

  public constructor(grid: Grid, type: number) {
    const model = PIECES[type]
    this.#grid = grid
    this.#type = type
    this.#x = Math.floor((GRID_WIDTH - model.length) / 2)
  }

  public get type(): number {
    return this.#type
  }

  public get cell(): number {
    return this.#type + 1
  }

  public shift(dx: number, dy: number): boolean {
    const x = this.#x + dx
    const y = this.#y + dy
    if (this.couldMoveTo(x, y, this.#r)) {
      this.#x = x
      this.#y = y
      return true
    } else {
      return false
    }
  }

  public rotate(dr: number): boolean {
    // We use a binary AND to stay within [0..3]
    const r = (this.#r + dr) & 3

    const wallKicks = getWallKicks(this.#type, dr >= 0)[this.#r]
    for (const [dx, dy] of wallKicks) {
      if (this.couldMoveTo(this.#x + dx, this.#y + dy, r)) {
        this.#x += dx
        this.#y += dy
        this.#r = r
        return true
      }
    }

    return false
  }

  public cells(): Generator<[number, number], void, void> {
    return iterCellPositions(this.#type, this.#x, this.#y, this.#r)
  }

  public draw(): void {
    for (const [x, y] of this.cells()) {
      this.#grid.setCell(x, y, this.cell)
    }
  }

  public erase(): void {
    for (const [x, y] of this.cells()) {
      this.#grid.setCell(x, y, 0)
    }
  }

  private couldMoveTo(newX: number, newY: number, newR: number): boolean {
    for (const [x, y] of iterCellPositions(this.#type, newX, newY, newR)) {
      if (!inBounds(x, y) || this.#grid.getCell(x, y) > 0) {
        return false
      }
    }

    return true
  }
}

function inBounds(x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < GRID_WIDTH && y < GRID_HEIGHT
}

function *iterCellPositions(type: number, x: number, y: number, r: number): Generator<[number, number], void, void> {
  const model = PIECES[type]
  const size = model.length
  for (let dy = 0; dy < size; dy++) {
    for (let dx = 0; dx < size; dx++) {
      if (modelHasCellAt(model, dx, dy, r)) {
        yield [x + dx, y - dy]
      }
    }
  }
}

function modelHasCellAt(model: number[][], x: number, y: number, r: number): boolean {
  const last = model.length - 1
  switch (r) {
    case 0: return model[y][x] > 0
    case 1: return model[last - x][y] > 0
    case 2: return model[last - y][last - x] > 0
    case 3: return model[x][last - y] > 0
    default: throw RangeError(`invalid rotation: ${r}`)
  }
}

function getWallKicks(type: number, clockwise: boolean): number[][][] {
  if (type === 0) {
    return clockwise
      ? WALL_KICKS_CLOCKWISE_I
      : WALL_KICKS_COUNTERCLOCKWISE_I
  } else if (type === 3) {
    return WALL_KICKS_O
  } else {
    return clockwise
      ? WALL_KICKS_CLOCKWISE_JLSTZ
      : WALL_KICKS_COUNTERCLOCKWISE_JLSTZ
  }
}
