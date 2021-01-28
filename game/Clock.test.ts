import { Clock } from './Clock.ts'
import { assert, assertEquals } from 'https://deno.land/std@0.84.0/testing/asserts.ts'

Deno.test('clock counts frames', () => {
  const clock = new Clock()
  clock.tick()
  clock.tick()
  clock.tick()
  clock.tick()
  assertEquals(clock.frame, 4)
})

Deno.test('clock ticks', () => {
  const clock = new Clock()
  assert(!clock.tick())
  clock.timer = 1
  assert(clock.tick())
  clock.timer = 3
  clock.timer = 5
  assert(!clock.tick())
  assert(!clock.tick())
  assert(!clock.tick())
  assert(!clock.tick())
  assert(clock.tick())
})
