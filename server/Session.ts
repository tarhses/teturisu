import { WebSocket } from 'https://deno.land/std@0.79.0/ws/mod.ts'
import { TICK_FRAMERATE } from '../game/constants.ts'
import { Input, Request, RequestType, Response, ResponseType } from '../game/protocol.ts'
import { Room } from './Room.ts'
import { Broker } from './Broker.ts'

export class Session {
  #socket: WebSocket
  #broker: Broker
  #room: Room
  #id: number
  #name: string = 'Anonymous'
  #inputs: Input[] = []
  #started: number = 0
  #bufferIndex: number = 0

  public constructor(socket: WebSocket, broker: Broker) {
    this.#socket = socket
    this.#broker = broker
    this.#room = broker.getRoom()
    this.#id = this.#room.addSession(this)
  }

  public get id(): number {
    return this.#id
  }

  public get name(): string {
    return this.#name
  }

  public get inputs(): Input[] {
    return this.#inputs
  }

  public get bufferedInputs(): Input[] {
    const inputs = this.#inputs.slice(this.#bufferIndex)
    this.#bufferIndex = this.#inputs.length
    return inputs
  }

  public get frame(): number {
    return this.#started > 0
      ? Math.floor((Date.now() - this.#started) / TICK_FRAMERATE)
      : 0
  }

  public handleRequest(req: Request): void {
    switch (req.type) {
      case RequestType.CREATE_ROOM: {
        this.#name = req.playerName
        const room = this.#broker.newRoom()
        this.join(room)
        break
      }

      case RequestType.JOIN_ROOM: {
        this.#name = req.playerName
        const room = this.#broker.getRoom(req.roomId)
        this.join(room)
        break
      }

      case RequestType.START_GAME: {
        if (!this.#room.started) {
          this.#room.start()
        }
        break
      }

      case RequestType.SEND_INPUT: {
        this.#inputs.push(...req.inputs)
        break
      }

      case RequestType.UPDATE_PROFILE: {
        this.#name = req.playerName
        this.#room.send({
          type: ResponseType.UPDATED_PROFILE,
          playerId: this.#id,
          playerName: this.#name
        })
        break
      }
    }
  }

  private join(room: Room): void {
    this.#room.removeSession(this)
    this.#room = room
    this.#id = room.addSession(this)
  }

  public start(now: number): void {
    this.#started = now
  }

  public leave(): void {
    this.#room.removeSession(this)
  }

  public notifyRemovedSession(session: Session): void {
    if (this.#id > session.#id) {
      this.#id -= 1
    }
  }

  public send(res: Response): void {
    this.sendRaw(JSON.stringify(res))
  }

  public sendRaw(json: string): void {
    this.#socket.send(json).catch(err => console.error(`send error: ${err}`))
  }
}
