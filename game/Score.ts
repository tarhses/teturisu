const LINES_PER_LEVEL = 10

const POINTS_PER_LINES = [0, 100, 300, 500, 800]

const DROP_FRAMES_PER_LEVEL = [60, 48, 37, 28, 21, 16, 11, 8, 6, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1]
const DROP_DISTANCE_PER_LEVEL = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 7, 11, 20]
const SOFT_DROP_FRAMES = 2
const LOCK_FRAMES = 30

export class Score {
  #score: number = 0
  #lines: number = 0

  public get score(): number {
    return this.#score
  }

  public get level(): number {
    return Math.floor(this.#lines / LINES_PER_LEVEL)
  }

  private get cappedLevel(): number {
    return Math.min(18, this.level)
  }

  public get dropFrames(): number {
    return DROP_FRAMES_PER_LEVEL[this.cappedLevel]
  }

  public get dropDistance(): number {
    return DROP_DISTANCE_PER_LEVEL[this.cappedLevel]
  }

  public get softDropFrames(): number {
    // Avoid making soft drops slower than normal drops
    return Math.min(SOFT_DROP_FRAMES, this.dropFrames)
  }

  public get lockFrames(): number {
    return LOCK_FRAMES
  }

  public registerLines(lines: number): void {
    // Score first, then lines
    this.#score += this.computePoints(lines)
    this.#lines += lines
  }

  public unregisterLines(lines: number): void {
    this.#lines -= lines
    this.#score -= this.computePoints(lines)
  }

  public registerSoftDrop(): void {
    this.#score += 1
  }

  public unregisterSoftDrop(): void {
    this.#score -= 1
  }

  private computePoints(lines: number): number {
    return POINTS_PER_LINES[lines] * (this.level + 1)
  }
}
