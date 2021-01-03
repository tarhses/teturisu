import { encode } from 'https://deno.land/std@0.79.0/encoding/base64url.ts'
import { Response, ResponseType } from '../game/protocol.ts'
import { Session } from './Session.ts'

const INTERVAL = 500

export class Room {
  #id: string
  #started: number = 0
  #seed: number = generateSeed()
  #sessions: Session[] = []
  #interval: number

  public constructor(id: string = generateId()) {
    this.#id = id
    this.#interval = setInterval(() => {
      const inputs = this.#sessions.map(s => s.bufferedInputs)
      if (inputs.some(i => i.length > 0)) {
        this.send({
          type: ResponseType.RECEIVED_INPUT,
          inputs
        })
      }
    }, INTERVAL)
  }

  public get id(): string {
    return this.#id
  }

  public get started(): boolean {
    return this.#started > 0
  }

  public start(): void {
    this.#started = Date.now()
    this.send({
      type: ResponseType.STARTED_GAME
    })

    const now = Date.now()
    for (const s of this.#sessions) {
      s.start(now)
    }
  }

  public addSession(session: Session): number {
    this.send({
      type: ResponseType.ADDED_PLAYER,
      playerName: session.name
    })

    const id = this.#sessions.length
    this.#sessions.push(session)
    if (this.started) {
      session.start(Date.now())
    }

    session.send({
      type: ResponseType.JOINED_ROOM,
      roomId: this.#id,
      players: this.#sessions.map(s => ({ name: s.name, inputs: s.inputs, frame: s.frame })),
      started: this.#started,
      seed: this.#seed
    })

    console.log(`[${this.#id}] session #${id} joined`)
    return id
  }

  public removeSession(session: Session): void {
    this.#sessions.splice(session.id, 1)
    this.send({
      type: ResponseType.REMOVED_PLAYER,
      playerId: session.id
    })

    for (const s of this.#sessions) {
      s.notifyRemovedSession(session)
    }

    console.log(`[${this.#id}] session #${session.id} left`)
  }

  public send(res: Response): void {
    const json = JSON.stringify(res)
    for (const session of this.#sessions) {
      session.sendRaw(json)
    }
  }
}

function generateId(size: number = 9): string {
  const bytes = new Uint8Array(size)
  crypto.getRandomValues(bytes)
  return encode(bytes)
}

function generateSeed(): number {
  const number = new Int32Array(1)
  crypto.getRandomValues(number)
  return number[0]
}
