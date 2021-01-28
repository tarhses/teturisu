export class Clock {
  #frame: number = 0
  #timer: number = 0

  public get frame(): number {
    return this.#frame
  }

  public set frame(frame: number) {
    this.#frame = frame
  }

  public set timer(frames: number) {
    this.#timer = frames
  }

  public tick(): boolean {
    this.#frame += 1
    if (this.#timer > 0) {
      this.#timer -= 1
      return this.#timer === 0
    } else {
      return false
    }
  }
}
