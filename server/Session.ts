import { Room } from './Room.ts'
import { Sender } from './Sender.ts'
import { Game } from '../game/Game.ts'
import { Req, ReqType, ResType, Err, Input } from '../game/protocol.ts'

export class Session {
  #id: number
  #name: string
  #room: Room
  #game: Game
  #inputs: InputBuffer = new InputBuffer()
  startTimestamp: number = 0
  #sender: Sender

  public constructor(name: string, room: Room, sender: Sender) {
    this.#name = name
    this.#id = room.add(this)
    this.#room = room
    this.#game = new Game(room.seed)
    this.#sender = sender
  }

  public get id(): number {
    return this.#id
  }

  public set id(id: number) {
    this.#id = id
  }

  public get name(): string {
    return this.#name
  }

  public get frame(): number {
    if (this.startTimestamp > 0) {
      const elapsed = performance.now() - this.startTimestamp
      return Math.floor(elapsed * 0.06)
    } else {
      return 0
    }
  }

  public get inputs(): Input[] {
    return this.#inputs.all
  }

  public get bufferedInputs(): Input[] {
    return this.#inputs.buffer
  }

  public get sender(): Sender {
    return this.#sender
  }

  public start(timestamp: number = performance.now()): void {
    this.startTimestamp = timestamp
  }

  public leave(): void {
    this.#room.remove(this)
  }

  public handleRequest(req: Req): void {
    switch (req.type) {
      case ReqType.START_GAME: return this.handleStartRequest()
      case ReqType.SEND_INPUTS: return this.handleInputsRequest(req.inputs)
      case ReqType.UPDATE_PROFILE: return this.handleProfileUpdateRequest(req.name)
    }
  }

  private handleStartRequest(): void {
    if (this.#room.started) {
      this.#sender.sendErr(Err.INVALID_REQUEST)
    } else {
      this.#room.start()
    }
  }

  private handleInputsRequest(inputs: Input[]): void {
    if (!this.#room.started) {
      this.#sender.sendErr(Err.INVALID_REQUEST)
    } else {
      for (const input of inputs) {
        const [move, frame] = input

        // TODO: check if inputs are alright? or maybe while validating?
        // * inputs.length < big number

        // TODO: check if frame is alright
        // * frame >= this.#game.frame
        // * frame === this.frame +- bias

        while (this.#game.frame < frame) {
          this.#game.handleFrame()
        }

        // TODO: send error or disconnect if unsuccessful?
        if (this.#game.handleMove(move)) {
          this.#inputs.push(input)
        }
      }
    }
  }

  private handleProfileUpdateRequest(name: string): void {
    this.#name = name
    this.#room.broadcast({
      type: ResType.UPDATED_PROFILE,
      id: this.#id,
      name,
    })
  }
}

class InputBuffer {
  #inputs: Input[] = []
  #index: number = 0

  public get all(): Input[] {
    return this.#inputs
  }

  public get buffer(): Input[] {
    const inputs = this.#inputs.slice(this.#index)
    this.#index += inputs.length
    return inputs
  }

  public push(input: Input): void {
    this.#inputs.push(input)
  }
}
