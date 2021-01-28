import { Grid, WIDTH, HEIGHT } from './Grid.ts'
import { Piece, PieceType } from './Piece.ts'
import { assert, assertEquals, assertArrayIncludes } from 'https://deno.land/std@0.84.0/testing/asserts.ts'

Deno.test('grid initialization', () => {
  const grid = new Grid()
  assertEquals(Array.from(grid), [])
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      assert(!grid.hasCell(x, y))
    }
  }
})

Deno.test('grid piece rendering', () => {
  const grid = new Grid()
  const piece = new Piece(grid, PieceType.O)

  grid.renderPiece(piece)

  assertArrayIncludes(Array.from(grid), [
    [4, 22, PieceType.O],
    [5, 22, PieceType.O],
    [4, 21, PieceType.O],
    [5, 21, PieceType.O],
  ])
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const hasCell = grid.hasCell(x, y)
      assertEquals(hasCell, (x === 4 || x === 5) && (y === 21 || y === 22))
    }
  }
})

Deno.test('grid piece erasing', () => {
  const grid = new Grid()
  const piece = new Piece(grid, PieceType.T)
  grid.renderPiece(piece)
  grid.erasePiece(piece)
  assertEquals(Array.from(grid), [])
})

Deno.test('grid lines erasing', () => {
  const grid = new Grid()
  const j = new Piece(grid, PieceType.J)
  assert(j.shift(-3, 0))
  j.render()
  const o = new Piece(grid, PieceType.O)
  assert(o.shift(4, 0))
  o.render()
  const s = new Piece(grid, PieceType.S)
  assert(s.rotate(1))
  assert(s.shift(2, 1))
  s.render()
  const i = new Piece(grid, PieceType.I)
  i.render()

  assertEquals(grid.eraseLines(), [{
    y: 21,
    cells: [2, 2, 2, 1, 1, 1, 1, 5, 4, 4],
  }])
  assertArrayIncludes(Array.from(grid), [
    [0, 21, PieceType.J],
    [6, 22, PieceType.S],
    [6, 21, PieceType.S],
    [7, 21, PieceType.S],
  ])
})

Deno.test('grid lines rendering', () => {
  const grid = new Grid()
  grid.renderPiece(new Piece(grid, PieceType.O))
  grid.renderLines([
    { y: 1, cells: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2] },
    { y: 3, cells: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  ])
  assertArrayIncludes(Array.from(grid), [
    [4, 24, PieceType.O],
    [5, 24, PieceType.O],
    [4, 23, PieceType.O],
    [5, 23, PieceType.O],
    [0, 3, PieceType.I],
    [1, 3, PieceType.I],
    [2, 3, PieceType.I],
    [3, 3, PieceType.I],
    [4, 3, PieceType.I],
    [5, 3, PieceType.I],
    [6, 3, PieceType.I],
    [7, 3, PieceType.I],
    [8, 3, PieceType.I],
    [9, 3, PieceType.I],
    [0, 1, PieceType.J],
    [1, 1, PieceType.J],
    [2, 1, PieceType.J],
    [3, 1, PieceType.J],
    [4, 1, PieceType.J],
    [5, 1, PieceType.J],
    [6, 1, PieceType.J],
    [7, 1, PieceType.J],
    [8, 1, PieceType.J],
    [9, 1, PieceType.J],
  ])
})
