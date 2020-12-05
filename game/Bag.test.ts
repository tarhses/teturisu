// @ts-ignore: file extension (deno compat)
import { Bag } from './Bag.ts'

describe('a bag', () => {
  test('does not generate duplicates', () => {
    const bag = new Bag()

    const pieces = new Set()
    for (let i = 0; i < 7; i++) {
      pieces.add(bag.take())
    }

    expect(pieces.size).toBe(7)
  })

  test('is seedable', () => {
    const a = new Bag(123)
    const b = new Bag(123)
    for (let i = 0; i < 100; i++) {
      expect(a.take()).toBe(b.take())
    }
  })

  test('is peekable', () => {
    const bag = new Bag()
    const pieces = bag.peek(15)
    for (let i = 0; i < 15; i++) {
      expect(bag.take()).toBe(pieces[i])
    }
  })

  test('is revertible', () => {
    const bag = new Bag()
    const piece = bag.take()
    bag.putBack(piece)
    expect(bag.take()).toBe(piece)
  })
})
