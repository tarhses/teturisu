// @ts-ignore: file extension (deno compat)
import { Grid } from './Grid.ts'
// @ts-ignore: file extension (deno compat)
import { GRID_WIDTH, GRID_HEIGHT } from './constants.ts'

describe('a grid', () => {
  test('is empty at first', () => {
    const grid = new Grid()
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        expect(grid.getCell(x, y)).toBe(0)
      }
    }
  })

  test('throws on invalid accesses', () => {
    const grid = new Grid()
    expect(() => grid.getCell(-1, 5)).toThrow(RangeError)
  })

  test('actually modifies cells', () => {
    const grid = new Grid()
    grid.setCell(6, 18, 3)
    expect(grid.getCell(6, 18)).toBe(3)
  })

  test('actually erases full lines', () => {
    const cells = []
    const grid = new Grid()
    for (let x = 0; x < GRID_WIDTH; x++) {
      grid.setCell(x, 4, 1)
      cells.push(1)
    }
    grid.setCell(5, 5, 2)

    const lines = grid.eraseFullLines()

    expect(grid.getCell(2, 4)).toBe(0)
    expect(grid.getCell(5, 4)).toBe(2)
    expect(lines).toStrictEqual([{ y: 4, cells }])
  })

  test('correctly resets full lines', () => {
    const grid = new Grid()
    for (let x = 0; x < GRID_WIDTH; x++) {
      grid.setCell(x, 14, 3)
      grid.setCell(x, 15, 4)
    }
    grid.setCell(2, 16, 5)
    const lines = grid.eraseFullLines()

    grid.resetFullLines(lines)

    expect(grid.getCell(9, 14)).toBe(3)
    expect(grid.getCell(7, 15)).toBe(4)
    expect(grid.getCell(2, 16)).toBe(5)
  })
})
