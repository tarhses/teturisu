import { WebSocket } from './deps.ts'
import { TICK } from '../game/constants.ts'
import { Input, Request, RequestType, Response, ResponseType } from '../game/protocol.ts'
import { Server } from './Server.ts'
import { Room } from './Room.ts'
import { Game } from '../game/Game.ts'

export class Session {
  #socket: WebSocket
  #server: Server
  #room: Room | null = null
  #name = 'Anonymous'
  #inputs = new InputBuffer()
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
      return Math.floor(elapsed / TICK)
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

      case RequestType.SUBMIT_SCORE:
        if (this.#room !== null && this.#inputs.verify(this.#room.seed, req.score, req.frame)) {
          this.#server.addScore(this.#name, req.score)
        }
        break

      case RequestType.GET_SCORES:
        this.send({
          type: ResponseType.GOT_SCORES,
          scores: this.#server.getScores(req.page)
        })
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

class InputBuffer {
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
    let frame = this.#inputs[this.#inputs.length - 1]?.[1] ?? 0
    for (const input of inputs) {
      if (input[1] >= frame) {
        frame = input[1]
        this.#inputs.push(input)
      } else {
        console.error(`input error: frame number decreasing (${input[1]} < ${frame})`)
      }
    }
  }

  public clear(): void {
    this.#inputs = []
    this.#index = 0
  }

  public verify(seed: number, score: number, frame: number): boolean {
    const game = new Game(seed)
    for (const [move, frame] of this.#inputs) {
      game.handleMove(move, frame)
    }

    while (!game.over) {
      game.handleTick()
    }

    if (game.score === score && game.frame === frame) {
      return true
    } else {
      console.error(`score error: submitted = ${score}@${frame}, computed = ${game.score}@${game.frame}`)
      return false
    }
  }
}
