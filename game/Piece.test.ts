// @ts-ignore: file extension (deno compat)
import { Piece } from './Piece.ts'
// @ts-ignore: file extension (deno compat)
import { Grid } from './Grid.ts'
// @ts-ignore: file extension (deno compat)
import { GRID_WIDTH, GRID_HEIGHT } from './constants.ts'

describe('a piece', () => {
  test('spawns at the right spot', () => {
    // J tetromino
    const piece = new Piece(new Grid(), 1)
    const cells = Array.from(piece.cells())
    expect(cells).toEqual([[3, 22], [3, 21], [4, 21], [5, 21]])
  })

  describe('can be shifted', () => {
    test('down', () => {
      // I tetromino
      const piece = new Piece(new Grid(), 0)
      const success = piece.shift(0, -1)
      const cells = Array.from(piece.cells())
      expect(success).toBe(true)
      expect(cells).toEqual([[3, 20], [4, 20], [5, 20], [6, 20]])
    })
  })

  describe('can be rotated', () => {
    test('clockwise', () => {
      // S tetromino
      const piece = new Piece(new Grid(), 4)
      const success = piece.rotate(1)
      const cells = Array.from(piece.cells())
      expect(success).toBe(true)
      expect(cells).toEqual([[4, 22], [4, 21], [5, 21], [5, 20]])
    })
  })

  test('can be drawn', () => {
    // O tetromino
    const grid = new Grid()
    const piece = new Piece(grid, 3)
    piece.draw()
    expect(grid.getCell(4, 22)).toBe(piece.cell)
    expect(grid.getCell(5, 22)).toBe(piece.cell)
    expect(grid.getCell(4, 21)).toBe(piece.cell)
    expect(grid.getCell(5, 21)).toBe(piece.cell)
  })

  test('can be erased', () => {
    // L tetromino
    const grid = new Grid()
    const piece = new Piece(grid, 2)
    piece.draw()
    piece.erase()
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        expect(grid.getCell(x, y)).toBe(0)
      }
    }
  })
})
