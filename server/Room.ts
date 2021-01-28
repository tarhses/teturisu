import { Server } from './Server.ts'
import { Session } from './Session.ts'
import { Res, ResType, Player } from '../game/protocol.ts'
import { encode } from './deps.ts'

const MAX_SESSIONS = 33
const INPUTS_PERIOD = 1000

export class Room {
  #id: string = generateId()
  #server: Server
  #sessions: Session[] = []
  #seed: number = generateSeed()
  #inputsInterval?: any

  public constructor(server: Server) {
    this.#server = server
  }

  public get id(): string {
    return this.#id
  }

  public get seed(): number {
    return this.#seed
  }

  public get started(): boolean {
    return this.#inputsInterval !== undefined
  }

  public get full(): boolean {
    return this.#sessions.length >= MAX_SESSIONS
  }

  public get players(): Player[] {
    return this.#sessions.map(session => ({
      name: session.name,
      frame: session.frame,
      inputs: session.inputs,
    }))
  }

  public add(session: Session): number {
    console.assert(!this.full, 'joining a full room')

    this.broadcast({
      type: ResType.ADDED_PLAYER,
      name: session.name,
    })

    const id = this.#sessions.length
    this.#sessions.push(session)

    if (this.started) {
      session.start()
    }

    return id
  }

  public remove(session: Session): void {
    this.#sessions.splice(session.id, 1)
    for (const other of this.#sessions) {
      if (other.id > session.id) {
        other.id -= 1
      }
    }

    if (this.#sessions.length > 0) {
      this.broadcast({
        type: ResType.REMOVED_PLAYER,
        id: session.id,
      })
    } else {
      clearInterval(this.#inputsInterval)
      this.#server.deleteRoom(this.#id)
    }
  }

  public start(): void {
    console.assert(!this.started, 'starting already started room')

    const now = performance.now()
    for (const session of this.#sessions) {
      session.startTimestamp = now
    }

    this.broadcast({ type: ResType.STARTED_GAME })

    this.#inputsInterval = setInterval(() => {
      const buffers = this.#sessions.map(session => session.bufferedInputs)
      if (buffers.some(buffer => buffer.length > 0)) {
        this.broadcast({
          type: ResType.SEND_INPUTS,
          inputs: buffers,
        })
      }
    }, INPUTS_PERIOD)
  }

  public broadcast(res: Res): void {
    const json = JSON.stringify(res)
    for (const session of this.#sessions) {
      session.sender.sendJson(json)
    }
  }
}

function generateId(): string {
  const bytes = new Uint8Array(9)
  crypto.getRandomValues(bytes)
  return encode(bytes)
}

function generateSeed(): number {
  const number = new Int32Array(1)
  crypto.getRandomValues(number)
  return number[0]
}
