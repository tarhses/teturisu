// Code adapted from 'prando' (https://github.com/zeh/prando)

const MIN = -2147483648
const MAX = 2147483647

export class Rng {
  #value: number

  public constructor(seed: number = random()) {
    this.#value = safe(seed)
  }

  public next(min: number, max: number): number {
    this.#value = shift(this.#value)
    return Math.floor(map(this.#value, MIN, MAX, min, max + 1))
  }
}

function random(): number {
  return MIN + Math.floor((MAX - MIN) * Math.random())
}

function safe(seed: number) {
  return seed === 0 ? 1 : seed
}

function shift(val: number) {
  // Based on George Marsaglia's work: http://www.jstatsoft.org/v08/i14/paper
  val ^= val << 13
  val ^= val >> 17
  val ^= val << 5
  return val
}

function map(val: number, minFrom: number, maxFrom: number, minTo: number, maxTo: number) {
  return (val - minFrom) / (maxFrom - minFrom) * (maxTo - minTo) + minTo
}
