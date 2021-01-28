// @ts-ignore: file extension (deno compat)
import type { Move, Input } from './protocol.ts'
// @ts-ignore: file extension (deno compat)
import { Game } from './Game.ts'
// @ts-ignore: file extension (deno compat)
import type { Line } from './Grid.ts'
// @ts-ignore: file extension (deno compat)
import type { Piece } from './Piece.ts'

const enum EntryType {
  DROP,
  GROUND,
  LOCK,
}

type Entry =
  { type: EntryType.DROP, frame: number } |
  { type: EntryType.GROUND, frame: number, soft: boolean } |
  { type: EntryType.LOCK, frame: number, piece: Piece, lines: Line[] }

export class BufferedGame extends Game {
  #buffer: Map<number, Move[]> = new Map()
  #history: Entry[] = []

  public handleInput([move, frame]: Input): void {
    if (frame < super.frame) {
      this.revertTo(frame)
    }

    let moves = this.#buffer.get(frame)
    if (moves === undefined) {
      moves = []
      this.#buffer.set(frame, moves)
    }

    moves.push(move)
  }

  public handleFrame(): void {
    const frame = super.frame
    const moves = this.#buffer.get(frame)
    if (moves !== undefined) {
      this.#buffer.delete(frame)
      for (const move of moves) {
        super.handleMove(move)
      }
    }

    super.handleFrame()
  }

  private revertTo(targetFrame: number): void {
    let keyFrame = 0
    if (this.#history.length > 0) {
      for (let i = this.#history.length - 1; i >= 0; i--) {
        const entry = this.#history[i]
        if (entry.frame >= targetFrame) {
          this.revertEntry(entry)
        } else {
          keyFrame = entry.frame // TODO: +1?
          this.#history = [entry]
          break
        }
      }
    }

    super.revertFrame(keyFrame)

    console.assert(keyFrame <= targetFrame, 'target frame > key frame')
    console.debug(`reverted to frame ${keyFrame} (target: ${targetFrame})`)
  }

  private revertEntry(entry: Entry): void {
    switch (entry.type) {
      case EntryType.DROP: return super.revertDrop()
      case EntryType.GROUND: return super.revertGround(entry.soft)
      case EntryType.LOCK: return super.revertLock(entry.piece, entry.lines)
    }
  }

  protected recordDrop(): void {
    this.#history.push({
      type: EntryType.DROP,
      frame: super.frame,
    })
  }

  protected recordGround(soft: boolean): void {
    this.#history.push({
      type: EntryType.GROUND,
      frame: super.frame,
      soft,
    })
  }

  protected recordLock(piece: Piece, lines: Line[]): void {
    this.#history.push({
      type: EntryType.LOCK,
      frame: super.frame,
      piece,
      lines,
    })
  }
}
