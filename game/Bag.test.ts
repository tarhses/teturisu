import { Bag } from './Bag.ts'
import { assertEquals, assertArrayIncludes } from 'https://deno.land/std@0.84.0/testing/asserts.ts'

Deno.test('bag has no duplicates', () => {
  const bag = new Bag()
  const pieces = []
  for (let i = 0; i < 7; i++) {
    pieces.push(bag.take())
  }
  assertArrayIncludes(pieces, [0, 1, 2, 3, 4, 5, 6])
})

Deno.test('bag is seedable', () => {
  const a = new Bag(123)
  const b = new Bag(123)
  for (let i = 0; i < 500; i++) {
    assertEquals(a.take(), b.take())
  }
})

Deno.test('bag is peekable', () => {
  const bag = new Bag()
  const pieces = bag.peek(500)
  for (let i = 0; i < 500; i++) {
    assertEquals(bag.take(), pieces[i])
  }
})

Deno.test('bag is revertible', () => {
  const bag = new Bag()
  const piece = bag.take()
  bag.putBack(piece)
  assertEquals(bag.take(), piece)
})
