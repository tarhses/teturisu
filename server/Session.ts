import { WebSocket } from './deps.ts'
import { TICK_FRAMERATE } from '../game/constants.ts'
import { Input, RequestType, Request, Response } from '../game/protocol.ts'
import { Server } from './Server.ts'
import { Room } from './Room.ts'

class Inputs {
  #inputs: Input[] = []
  #index = 0

  public get all(): Input[] {
    return this.#inputs
  }

  public get buffer(): Input[] {
    const inputs = this.#inputs.slice(this.#index)
    this.#index = this.#inputs.length
    return inputs
  }

  public push(inputs: Input[]): void {
    this.#inputs.push(...inputs)
  }

  public clear(): void {
    this.#inputs = []
    this.#index = 0
  }
}

export class Session {
  #socket: WebSocket
  #server: Server
  #room: Room | null = null
  #name = 'Anonymous'
  #inputs = new Inputs()
  #startTimestamp = 0

  public constructor(socket: WebSocket, server: Server) {
    this.#socket = socket
    this.#server = server
  }

  public get name(): string {
    return this.#name
  }

  public get inputs(): Input[] {
    return this.#inputs.all
  }

  public get bufferedInputs(): Input[] {
    return this.#inputs.buffer
  }

  public connect(room: Room): void {
    this.disconnect()
    room.addSession(this)
    this.#room = room
  }

  public disconnect(): void {
    if (this.#room !== null) {
      this.#room.removeSession(this)
      this.#room = null
      this.#inputs.clear()
      this.#startTimestamp = 0
    }
  }

  public start(timestamp: number = performance.now()): void {
    this.#startTimestamp = timestamp
  }

  public get frame(): number {
    if (this.#startTimestamp > 0) {
      const elapsed = performance.now() - this.#startTimestamp
      return Math.floor(elapsed / TICK_FRAMERATE)
    } else {
      return 0
    }
  }

  public handleRequest(req: Request): void {
    switch (req.type) {
      case RequestType.CREATE_ROOM:
        this.connect(this.#server.newRoom())
        break

      case RequestType.JOIN_ROOM:
        this.connect(this.#server.getRoom(req.id))
        break

      case RequestType.START_GAME:
        if (this.#room !== null && !this.#room.started) {
          this.#room.start()
        }
        break

      case RequestType.SEND_INPUT:
        if (this.#room !== null && this.#room.started) {
          this.#inputs.push(req.inputs)
        }
        break

      case RequestType.UPDATE_PROFILE:
        this.#name = req.name
        if (this.#room !== null) {
          this.#room.sendUpdatedProfile(this, req.name)
        }
        break
    }
  }

  public send(res: Response): void {
    const json = JSON.stringify(res)
    this.sendRaw(json)
  }

  public sendRaw(json: string): void {
    this.#socket.send(json).catch(err => console.error(`send error: ${err}`))
  }
}
