// @ts-ignore: file extension (deno compat)
import { Move } from './protocol.ts'
// @ts-ignore: file extension (deno compat)
import { Clock } from './Clock.ts'
// @ts-ignore: file extension (deno compat)
import { Score } from './Score.ts'
// @ts-ignore: file extension (deno compat)
import { Grid, Line } from './Grid.ts'
// @ts-ignore: file extension (deno compat)
import { Piece } from './Piece.ts'
// @ts-ignore: file extension (deno compat)
import { Bag } from './Bag.ts'

const enum State {
  DROPPING,
  SOFT_DROPPING,
  LOCKING,
  OVER,
}

export class Game {
  #state: State = State.DROPPING
  #clock: Clock = new Clock()
  #score: Score = new Score()
  #grid: Grid = new Grid()
  #piece: Piece
  #bag: Bag

  public constructor(seed?: number) {
    this.#bag = new Bag(seed)
    this.#piece = new Piece(this.#grid, this.#bag.take())
    this.#clock.timer = this.#score.dropFrames
  }

  public get over(): boolean {
    return this.#state === State.OVER
  }

  public get frame(): number {
    return this.#clock.frame
  }

  public handleFrame(): void {
    if (!this.over) {
      if (this.#clock.tick()) {
        this.handleTick()
        this.#clock.timer = this.timer
      }
    }
  }

  private handleTick(): void {
    switch (this.#state) {
      case State.DROPPING: return this.handleDrop(false)
      case State.SOFT_DROPPING: return this.handleDrop(true)
      case State.LOCKING: return this.handleLock()
    }
  }

  private handleDrop(soft: boolean): void {
    const distance = this.#score.dropDistance
    for (let i = 0; i < distance; i++) {
      if (this.#piece.shift(0, -1)) {
        this.recordDrop()
        if (soft) {
          this.#score.registerSoftDrop()
        }
      } else {
        this.recordGround(soft)
        this.#state = State.LOCKING
        break
      }
    }
  }

  private handleLock(): void {
    this.#piece.render()
    let over = !this.#piece.visible

    const lines = this.#grid.eraseLines()
    this.#score.registerLines(lines.length)
    this.recordLock(this.#piece, lines)

    this.#piece = new Piece(this.#grid, this.#bag.take())
    if (this.#piece.overlapping) {
      over = true
    }

    this.#state = over ? State.OVER : State.DROPPING
  }

  private get timer(): number {
    switch (this.#state) {
      case State.DROPPING: return this.#score.dropFrames
      case State.SOFT_DROPPING: return this.#score.softDropFrames
      case State.LOCKING: return this.#score.lockFrames
      case State.OVER: return 0
    }
  }

  public handleMove(move: Move): boolean {
    if (this.over) {
      return false
    } else {
      switch (move) {
        case Move.LEFT_SHIFT: return this.handleShift(-1)
        case Move.RIGHT_SHIFT: return this.handleShift(1)
        case Move.LEFT_ROTATION: return this.handleRotation(-1)
        case Move.RIGHT_ROTATION: return this.handleRotation(1)
        case Move.HARD_DROP: return this.handleHardDrop()
        case Move.SOFT_DROP_START: return this.handleSoftDropStart()
        case Move.SOFT_DROP_END: return this.handleSoftDropEnd()
        default: throw new RangeError()
      }
    }
  }

  private handleShift(dx: number): boolean {
    return this.handlePieceMove(this.#piece.shift(dx, 0))
  }

  private handleRotation(dr: number): boolean {
    return this.handlePieceMove(this.#piece.rotate(dr))
  }

  private handlePieceMove(success: boolean): boolean {
    if (success && this.#state === State.LOCKING) {
      this.#state = State.DROPPING
      this.#clock.timer = this.#score.dropFrames
    }

    return success
  }

  private handleHardDrop(): boolean {
    return false // TODO
  }

  private handleSoftDropStart(): boolean {
    if (this.#state === State.DROPPING) {
      this.#state = State.SOFT_DROPPING
      this.#clock.timer = this.#score.softDropFrames
      return true
    } else {
      return false
    }
  }

  private handleSoftDropEnd(): boolean {
    if (this.#state === State.SOFT_DROPPING) {
      this.#state = State.DROPPING
      return true
    } else {
      return false
    }
  }

  protected recordDrop(): void {}

  protected recordGround(soft: boolean): void {}

  protected recordLock(piece: Piece, lines: Line[]): void {}

  protected revertFrame(frame: number): void {
    this.#clock.frame = frame
    this.#clock.timer = this.timer
  }

  protected revertDrop(): void {
    this.#piece.shift(0, 1)
    if (this.#state === State.SOFT_DROPPING) {
      this.#score.unregisterSoftDrop()
    }
  }

  protected revertGround(soft: boolean): void {
    this.#state = soft ? State.SOFT_DROPPING : State.DROPPING
  }

  protected revertLock(piece: Piece, lines: Line[]): void {
    this.#score.unregisterLines(lines.length)
    this.#grid.renderLines(lines)
    this.#bag.putBack(this.#piece.type)
    this.#piece = piece
    piece.erase()
    this.#state = State.LOCKING
  }
}
