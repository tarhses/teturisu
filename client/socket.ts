import type { Req, Res } from '../game/protocol'

type Callback = (res: Res) => void

class Socket {
  #socket: WebSocket
  #buffer: Req[] = []
  #callbacks: Set<Callback> = new Set()

  public constructor(url: string) {
    this.#socket = new WebSocket(url)

    this.#socket.addEventListener('open', e => {
      const buffer = this.#buffer
      this.#buffer = [] // avoid endless recursion
      for (const req of buffer) {
        this.send(req)
      }
    })

    this.#socket.addEventListener('message', e => {
      const res = JSON.parse(e.data) as Res
      console.debug('received', res)
      for (const callback of this.#callbacks) {
        callback(res)
      }
    })
  }

  public send(req: Req): void {
    if (this.#socket.readyState === WebSocket.OPEN) {
      console.debug('sending', req)
      this.#socket.send(JSON.stringify(req))
    } else {
      this.#buffer.push(req)
    }
  }

  public addCallback(callback: Callback): void {
    this.#callbacks.add(callback)
  }

  public removeCallback(callback: Callback): void {
    this.#callbacks.delete(callback)
  }
}

// TODO?: don't change port in production
const host = location.origin
  .replace('http', 'ws')
  .replace('8000', '8001')

export default new Socket(`${host}/ws`)
