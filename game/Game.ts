// @ts-ignore: file extension (deno compat)
import { GRID_WIDTH, GRID_HEIGHT, DROP_TICKS, SOFT_DROP_TICKS, LOCK_TICKS } from './constants.ts'
// @ts-ignore: file extension (deno compat)
import { Move } from './protocol.ts'
// @ts-ignore: file extension (deno compat)
import { Grid, Line } from './Grid.ts'
// @ts-ignore: file extension (deno compat)
import { Piece } from './Piece.ts'
// @ts-ignore: file extension (deno compat)
import { Bag } from './Bag.ts'

const enum State {
  DROPPING,
  SOFT_DROPPING,
  LOCKING
}

const enum EntryType {
  DROPPED,
  LOCKING,
  LOCKED
}

type Entry =
  { type: EntryType.DROPPED, frame: number } |
  { type: EntryType.LOCKING, frame: number, soft: boolean } |
  { type: EntryType.LOCKED, frame: number, piece: Piece, lines: Line[] }

export class Game {
  #grid = new Grid()
  #piece: Piece
  #bag: Bag
  #state = State.DROPPING
  #frame = 0
  #counter: number
  #buffer: Map<number, Move[]> = new Map()
  #history: Entry[] = []

  public constructor(seed?: number) {
    this.#bag = new Bag(seed)
    this.#piece = this.newPiece()
    this.#counter = this.counterLimit
  }

  public get frame(): number {
    return this.#frame
  }

  public handleTick(): void {
    this.executeMoves()
    if (this.#counter === 0) {
      this.update()
      this.#counter = this.counterLimit
    } else {
      this.#counter -= 1
    }

    this.#frame += 1
  }

  private update(): void {
    switch (this.#state) {
      case State.DROPPING:
      case State.SOFT_DROPPING:
        const success = this.#piece.shift(0, -1)
        if (success) {
          this.#history.push({
            type: EntryType.DROPPED,
            frame: this.#frame
          })
        } else {
          this.#history.push({
            type: EntryType.LOCKING,
            frame: this.#frame,
            soft: this.#state === State.SOFT_DROPPING
          })
          this.#state = State.LOCKING
        }
        break

      case State.LOCKING:
        this.#piece.draw()
        this.#history.push({
          type: EntryType.LOCKED,
          frame: this.#frame,
          piece: this.#piece,
          lines: this.#grid.eraseFullLines()
        })

        this.#piece = this.newPiece()
        this.#state = State.DROPPING
        break
    }
  }

  private executeMoves(): void {
    const moves = this.#buffer.get(this.#frame)
    if (moves !== undefined) {
      this.#buffer.delete(this.#frame)
      for (const move of moves) {
        const success = this.executeMove(move)
        if (success && this.#state === State.LOCKING) {
          this.#state = State.DROPPING
        }
      }
    }
  }

  private executeMove(move: Move): boolean {
    switch (move) {
      case Move.LEFT_SHIFT:
        return this.#piece.shift(-1, 0)

      case Move.RIGHT_SHIFT:
        return this.#piece.shift(1, 0)

      case Move.LEFT_ROTATION:
        return this.#piece.rotate(-1)

      case Move.RIGHT_ROTATION:
        return this.#piece.rotate(1)

      case Move.HARD_DROP:
        return false // TODO

      case Move.START_SOFT_DROP:
        if (this.#state === State.DROPPING) {
          this.#state = State.SOFT_DROPPING
          this.#counter = this.counterLimit
          return true
        } else {
          return false
        }

      case Move.STOP_SOFT_DROP:
        if (this.#state === State.SOFT_DROPPING) {
          this.#state = State.DROPPING
          return true
        } else {
          return false
        }

      default:
        return false
    }
  }

  public handleMove(move: Move, frame: number = this.#frame): void {
    if (frame < this.#frame) {
      this.revertEntries(frame)
    }

    let moves = this.#buffer.get(frame)
    if (moves === undefined) {
      moves = []
      this.#buffer.set(frame, moves)
    }

    moves.push(move)
  }

  private revertEntries(targetFrame: number): void {
    let keyFrame = 0
    if (this.#history.length > 0) {
      for (let i = this.#history.length - 1; i >= 0; i--) {
        const entry = this.#history[i]
        if (entry.frame >= targetFrame) {
          this.revertEntry(entry)
        } else {
          keyFrame = entry.frame + 1
          this.#history.splice(i + 1)
          break
        }
      }
    }

    this.#frame = keyFrame
    this.#counter = this.counterLimit

    console.assert(keyFrame <= targetFrame, 'target frame > key frame')
    console.log(`rollback to ${keyFrame} (target: ${targetFrame})`)
  }

  private revertEntry(entry: Entry): void {
    switch (entry.type) {
      case EntryType.DROPPED:
        this.#piece.shift(0, 1)
        break

      case EntryType.LOCKING:
        this.#state = entry.soft ? State.SOFT_DROPPING : State.DROPPING
        break

      case EntryType.LOCKED:
        this.#grid.resetFullLines(entry.lines)

        this.#bag.putBack(this.#piece.type)
        this.#piece = entry.piece
        this.#piece.erase()

        this.#state = State.LOCKING
        break
    }
  }

  public *cells(): Generator<[number, number, number], void, void> {
    for (const [x, y] of this.#piece.cells()) {
      yield [x, y, this.#piece.cell]
    }

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cell = this.#grid.getCell(x, y)
        if (cell > 0) {
          yield [x, y, cell]
        }
      }
    }
  }

  private newPiece(): Piece {
    return new Piece(this.#grid, this.#bag.take())
  }

  private get counterLimit(): number {
    switch (this.#state) {
      case State.DROPPING: return DROP_TICKS - 1
      case State.SOFT_DROPPING: return SOFT_DROP_TICKS - 1
      case State.LOCKING: return LOCK_TICKS - 1
    }
  }
}
