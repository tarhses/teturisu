import { Score } from './Score.ts'
import { assert, assertEquals } from 'https://deno.land/std@0.84.0/testing/asserts.ts'

Deno.test('levels are unlimited', () => {
  const score = new Score()
  for (let i = 0; i < 1000; i++) {
    const level = score.level
    const dropFrames = score.dropFrames
    const dropDistance = score.dropDistance
    const softDropFrames = score.softDropFrames
    const lockFrames = score.lockFrames
    score.registerLines(4)
    score.registerLines(4)
    score.registerLines(2)
    assertEquals(score.level, level + 1)
    assert(score.dropFrames <= dropFrames)
    assert(score.dropDistance >= dropDistance)
    assert(score.softDropFrames <= softDropFrames)
    assert(score.lockFrames <= lockFrames)
  }
})

Deno.test('score increases based on level', () => {
  const score = new Score()
  assertEquals(score.score, 0)
  score.registerLines(4) // level 1 => +800 * 1
  assertEquals(score.score, 800)
  score.registerLines(4) // level 1 => +800 * 1
  assertEquals(score.score, 1600)
  score.registerLines(4) // level 1 => +800 * 1
  assertEquals(score.score, 2400)
  score.registerLines(1) // level 2 => +100 * 2
  assertEquals(score.score, 2600)
})

Deno.test('score is revertible (lines)', () => {
  const score = new Score()
  score.registerLines(3)
  score.registerLines(4)
  const previous = score.score
  score.registerLines(2)
  score.registerLines(3)
  score.registerLines(2)
  score.registerLines(4)
  score.unregisterLines(4)
  score.unregisterLines(2)
  score.unregisterLines(3)
  score.unregisterLines(2)
  assertEquals(score.score, previous)
})

Deno.test('score is revertible (soft drops)', () => {
  const score = new Score()
  score.registerSoftDrop()
  score.registerSoftDrop()
  score.registerSoftDrop()
  score.unregisterSoftDrop()
  score.unregisterSoftDrop()
  score.unregisterSoftDrop()
  assertEquals(score.score, 0)
})
