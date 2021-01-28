import { Piece, PieceType } from './Piece.ts'
import { Grid } from './Grid.ts'
import { assert, assertArrayIncludes } from 'https://deno.land/std@0.84.0/testing/asserts.ts'

Deno.test('piece initialization', () => {
  const grid = new Grid()
  const piece = new Piece(grid, PieceType.L)
  assert(!piece.overlapping)
  assertArrayIncludes(Array.from(piece), [[3, 21], [4, 21], [5, 21], [5, 22]])
})

Deno.test('piece visible', () => {
  const grid = new Grid()
  const piece = new Piece(grid, PieceType.J)
  assert(!piece.visible)
  piece.shift(0, -1)
  assert(!piece.visible)
  piece.shift(0, -1)
  assert(piece.visible)
})

Deno.test('piece overlapping', () => {
  const grid = new Grid()
  const piece = new Piece(grid, PieceType.S)
  grid.renderPiece(new Piece(grid, PieceType.I))
  assert(piece.overlapping)
})

Deno.test('piece shifting', () => {
  const grid = new Grid()
  const piece = new Piece(grid, PieceType.Z)
  assert(piece.shift(0, -1))
  assertArrayIncludes(Array.from(piece), [[3, 21], [4, 21], [4, 20], [5, 20]])
})

Deno.test('piece rotating', () => {
  const grid = new Grid()
  const piece = new Piece(grid, PieceType.I)
  assert(piece.rotate(1))
  assertArrayIncludes(Array.from(piece), [[5, 22], [5, 21], [5, 20], [5, 19]])
})
