// Code adapted from 'prando' (https://github.com/zeh/prando)

// Minimum and maximum for a signed 32 bits integer
const MIN = -2147483648
const MAX = 2147483647

export class Rng {
	private seed: number
	private value: number

	constructor(seed: number = randomInt()) {
    this.seed = safe(seed)
		this.value = this.seed
	}

	public next(min: number = 0, max: number = 1): number {
		this.value = xorshift(this.value)
		return map(this.value, MIN, MAX, min, max)
	}

	public nextInt(min: number, max: number): number {
    return Math.floor(this.next(min, max + 1))
	}
}

function randomInt(): number {
  return MIN + Math.floor((MAX - MIN) * Math.random())
}

function safe(seed: number) {
  return seed === 0 ? 1 : seed
}

function xorshift(val: number) {
  // Based on George Marsaglia's work: http://www.jstatsoft.org/v08/i14/paper
  val ^= val << 13
  val ^= val >> 17
  val ^= val << 5
  return val
}

function map(val: number, minFrom: number, maxFrom: number, minTo: number, maxTo: number) {
  return (val - minFrom) / (maxFrom - minFrom) * (maxTo - minTo) + minTo
}
