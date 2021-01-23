import { encode } from './deps.ts'
import { Response, ResponseType } from '../game/protocol.ts'
import { Server } from './Server.ts'
import { Session } from './Session.ts'

const INPUTS_INTERVAL = 1000

export class Room {
  #id = generateId()
  #server: Server
  #sessions: Session[] = []
  #seed = generateSeed()
  #startTimestamp = 0
  #inputsInterval?: number

  public constructor(server: Server) {
    this.#server = server
    this.log('created')
  }

  public delete(): void {
    clearInterval(this.#inputsInterval)
    this.#server.deleteRoom(this.#id)
    this.log('deleted')
  }

  public get id(): string {
    return this.#id
  }

  public start(): void {
    console.assert(!this.started)
    this.log('starting')

    this.send({ type: ResponseType.STARTED_GAME })

    this.#startTimestamp = performance.now()
    for (const session of this.#sessions) {
      session.start(this.#startTimestamp)
    }

    this.#inputsInterval = setInterval(() => {
      const inputs = this.#sessions.map(s => s.bufferedInputs)
      if (inputs.some(i => i.length > 0)) {
        this.send({ type: ResponseType.RECEIVED_INPUT, inputs })
      }
    }, INPUTS_INTERVAL)
  }

  public get started(): boolean {
    return this.#startTimestamp > 0
  }

  public addSession(session: Session): void {
    console.assert(!this.#sessions.includes(session))
    this.log(`'${session.name}' joining`)

    this.send({ type: ResponseType.ADDED_PLAYER, name: session.name })

    this.#sessions.push(session)
    if (this.started) {
      session.start()
    }

    session.send({
      type: ResponseType.JOINED_ROOM,
      id: this.#id,
      seed: this.#seed,
      started: this.started,
      players: this.#sessions.map(s => ({
        name: s.name,
        frame: s.frame,
        inputs: s.inputs
      }))
    })
  }

  public removeSession(session: Session): void {
    const id = this.#sessions.indexOf(session)

    console.assert(id >= 0)
    this.log(`'${session.name}' leaving`)

    this.#sessions.splice(id, 1)
    if (this.#sessions.length > 0) {
      this.send({ type: ResponseType.REMOVED_PLAYER, id })
    } else {
      this.delete()
    }
  }

  public send(res: Response): void {
    const json = JSON.stringify(res)
    for (const session of this.#sessions) {
      session.sendRaw(json)
    }
  }

  public sendUpdatedProfile(session: Session, name: string): void {
    const id = this.#sessions.indexOf(session)
    console.assert(id >= 0)
    this.send({ type: ResponseType.UPDATED_PROFILE, id, name })
  }

  private log(text: string): void {
    console.log(`room ${this.#id} | ${text}`)
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
