import { serve } from 'https://deno.land/std@0.79.0/http/server.ts'
import { acceptWebSocket, WebSocket } from 'https://deno.land/std@0.79.0/ws/mod.ts'
import { Request, RequestType } from '../game/protocol.ts'
import { Broker } from './Broker.ts'
import { Session } from './Session.ts'

const broker = new Broker()

if (import.meta.main) {
  const port = Deno.env.get('PORT') ?? '8001'
  for await (const req of serve(`:${port}`)) {
    const { conn, r: bufReader, w: bufWriter, headers } = req
    acceptWebSocket({ conn, bufReader, bufWriter, headers })
      .then(handleWebsocket)
      .catch(err => console.error(`connection error: ${err}`))
  }
}

async function handleWebsocket(socket: WebSocket): Promise<void> {
  const session = new Session(socket, broker)

  try {
    for await (const msg of socket) {
      if (typeof msg === 'string') {
        const req = parseRequest(msg)
        session.handleRequest(req)
      }
    }
  } catch (err) {
    console.error(`session error: ${err}`)
    if (!socket.isClosed) {
      await socket.close(1000).catch(console.error)
    }
  }

  session.leave()
}

function parseRequest(json: string): Request {
  const req: Request = JSON.parse(json)
  if (typeof req.type !== 'number' || req.type >= RequestType.COUNT) {
    throw new TypeError(`invalid request (type = ${req.type})`)
  }

  switch (req.type) {
    // TODO: validation
  }

  return req
}
