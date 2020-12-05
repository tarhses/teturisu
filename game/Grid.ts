// @ts-ignore: file extension (deno compat)
import { GRID_WIDTH, GRID_HEIGHT } from './constants.ts'

export interface Line {
  y: number
  cells: number[]
}

export class Grid {
  private cells: number[] = []

  public constructor() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        this.cells.push(0)
      }
    }
  }

  public getCell(x: number, y: number): number {
    const i = computeIndex(x, y)
    return this.cells[i]
  }

  public setCell(x: number, y: number, cell: number): void {
    const i = computeIndex(x, y)
    this.cells[i] = cell
  }

  public eraseFullLines(): Line[] {
    const clearedLines: Line[] = []
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      if (this.isLineFull(y)) {
        clearedLines.push(this.getLine(y))
        this.clearLine(y)
      }
    }

    return clearedLines
  }

  private isLineFull(y: number): boolean {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (this.getCell(x, y) === 0) {
        return false
      }
    }

    return true
  }

  private getLine(y: number): Line {
    const i = y * GRID_WIDTH
    const cells = this.cells.slice(i, i + GRID_WIDTH)
    return { y, cells }
  }

  private clearLine(y: number): void {
    // Shift every line
    for (; y + 1 < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cell = this.getCell(x, y + 1)
        this.setCell(x, y, cell)
      }
    }

    // Clear the top one
    for (let x = 0; x < GRID_WIDTH; x++) {
      this.setCell(x, y, 0)
    }
  }

  public resetFullLines(lines: Line[]): void {
    lines.sort((a, b) => a.y - b.y)
    for (const line of lines) {
      this.resetLine(line)
    }
  }

  private resetLine(line: Line): void {
    // Shift lines above
    for (let y = GRID_HEIGHT - 1; y > line.y; y--) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cell = this.getCell(x, y - 1)
        this.setCell(x, y, cell)
      }
    }

    // Put it back
    for (const cell of line.cells) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        this.setCell(x, line.y, cell)
      }
    }
  }
}

function computeIndex(x: number, y: number): number {
  if (x < 0 || y < 0 || x >= GRID_WIDTH || y >= GRID_HEIGHT) {
    throw new RangeError(`invalid grid index: (${x},${y})`)
  } else {
    return y * GRID_WIDTH + x
  }
}
