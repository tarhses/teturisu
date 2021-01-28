import { Res, Err } from '../game/protocol.ts'
import { WebSocket } from './deps.ts'

export abstract class Sender {
  public sendRes(res: Res): void {
    const json = JSON.stringify(res)
    this.sendJson(json)
  }

  public sendErr(err: Err): void {
    this.sendJson(`{"error":${err}}`)
  }

  public abstract sendJson(json: string): void
}

export class WebSocketSender extends Sender {
  #socket: WebSocket

  public constructor(socket: WebSocket) {
    super()
    this.#socket = socket
  }

  public sendJson(json: string): void {
    this.#socket.send(json)
      .catch(err => console.error(`ws send error: ${err}`))
  }
}

export class MockSender extends Sender {
  #responses: Res[] = []

  public get responses(): Res[] {
    return this.#responses
  }

  public sendJson(json: string): void {
    this.#responses.push(JSON.parse(json))
  }
}
