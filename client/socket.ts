import type { Response, Request } from '../game/protocol'

type Callback = (res: Response) => void

class Socket {
  #socket: WebSocket
  #callbacks: Set<Callback> = new Set()

  public constructor(url: string) {
    this.#socket = new WebSocket(url)
    this.#socket.addEventListener('message', e => {
      const res = JSON.parse(e.data) as Response
      for (const callback of this.#callbacks) {
        callback(res)
      }
    })
  }

  public send(req: Request): void {
    if (this.#socket.readyState === WebSocket.OPEN) {
      this.#socket.send(JSON.stringify(req))
    }
  }

  public addCallback(callback: Callback): void {
    this.#callbacks.add(callback)
  }

  public removeCallback(callback: Callback): void {
    this.#callbacks.delete(callback)
  }
}

export default new Socket('ws://10.182.207.139:8001')
