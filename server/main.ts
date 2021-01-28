import { Leaderboard } from './Leaderboard.ts'
import { Server } from './Server.ts'
import { Connection } from './Connection.ts'
import { WebSocketSender } from './Sender.ts'
import { serve, acceptWebSocket, WebSocket } from './deps.ts'
import { Req } from '../game/protocol.ts'

const port = Deno.env.get('PORT') ?? '8001'
const database = Deno.env.get('DATABASE')

const highscores = new Leaderboard(database)
const server = new Server(highscores)

console.info(`listening on port ${port}`)

for await (const req of serve(`:${port}`)) {
  const { conn, r: bufReader, w: bufWriter, headers } = req
  acceptWebSocket({ conn, bufReader, bufWriter, headers })
    .then(handleWebsocket)
    .catch(err => console.error(`connection error: ${err}`))
}

async function handleWebsocket(socket: WebSocket): Promise<void> {
  const conn = new Connection(server, new WebSocketSender(socket))
  try {
    for await (const msg of socket) {
      if (typeof msg === 'string') {
        const req = parseRequest(msg)
        conn.handleRequest(req)
      }
    }
  } catch (err) {
    console.error(`session error: ${err}`)
  } finally {
    conn.disconnect()
    if (!socket.isClosed) {
      socket.close(1000)
        .catch(err => console.error(`closing error: ${err}`))
    }
  }
}

function parseRequest(json: string): Req {
  // TODO: validation
  return JSON.parse(json) as Req
}
