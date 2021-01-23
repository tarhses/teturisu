import { serve, acceptWebSocket, WebSocket } from './deps.ts'
import { validateRequest } from './validation.ts'
import { Server } from './Server.ts'
import { Session } from './Session.ts'
import { Request } from '../game/protocol.ts'

const port = Deno.env.get('PORT') ?? '8001'
const server = new Server()

console.info(`listening on port ${port}`)

for await (const req of serve(`:${port}`)) {
  const { conn, r: bufReader, w: bufWriter, headers } = req
  acceptWebSocket({ conn, bufReader, bufWriter, headers })
    .then(handleWebsocket)
    .catch(err => console.error(`connection error: ${err}`))
}

async function handleWebsocket(socket: WebSocket): Promise<void> {
  const session = new Session(socket, server)
  try {
    for await (const msg of socket) {
      if (typeof msg === 'string') {
        const req = parseRequest(msg)
        if (req !== null) {
          session.handleRequest(req)
        }
      }
    }
  } catch (err) {
    console.error(`session error: ${err}`)
    if (!socket.isClosed) {
      socket.close(1000).catch(err => console.error(`closing error: ${err}`))
    }
  } finally {
    session.disconnect()
  }
}

function parseRequest(json: string): Request | null {
  const req = JSON.parse(json) as Request

  try {
    validateRequest(req)
  } catch (err) {
    console.error(`validation error: ${err}, ${json}`)
    return null
  }

  return req
}
