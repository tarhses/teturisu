import socket from './socket'
import { Req, ReqType, Res, ResType, ErrType, Input, Player, Highscore } from '../game/protocol'

export interface RoomInfo {
  id: string
  seed: number
  started: boolean
  players: Player[]
}

export function joinPublicRoom(): Promise<RoomInfo> {
  // @ts-ignore: JOINED_ROOM implements RoomInfo
  return sendAndWaitFor(
    { type: ReqType.JOIN_ROOM },
    ResType.JOINED_ROOM,
  )
}

export function joinPrivateRoom(id: string): Promise<RoomInfo> {
  // @ts-ignore: JOINED_ROOM implements RoomInfo
  return sendAndWaitFor(
    { type: ReqType.JOIN_ROOM, id },
    ResType.JOINED_ROOM,
  )
}

export function createRoom(): Promise<RoomInfo> {
  // @ts-ignore: JOINED_ROOM implements RoomInfo
  return sendAndWaitFor(
    { type: ReqType.CREATE_ROOM },
    ResType.JOINED_ROOM,
  )
}

export async function leaveRoom(): Promise<void> {
  await sendAndWaitFor(
    { type: ReqType.LEAVE_ROOM },
    ResType.LEFT_ROOM,
  )
}

export async function startGame(): Promise<void> {
  await sendAndWaitFor(
    { type: ReqType.START_GAME },
    ResType.STARTED_GAME,
  )
}

export function sendInputs(inputs: Input[]): void {
  socket.send({ type: ReqType.SEND_INPUTS, inputs })
}

export function submitScore(): void {
  socket.send({ type: ReqType.SUBMIT_SCORE })
}

export async function getHighscores(page?: number): Promise<Highscore[]> {
  const res = await sendAndWaitFor(
    { type: ReqType.GET_HIGHSCORES, page },
    ResType.GOT_HIGHSCORES,
  )

  // @ts-ignore: GOT_HIGHSCORES has a scores field
  return res.scores
}

export async function updateProfile(name: string): Promise<void> {
  await sendAndWaitFor(
    { type: ReqType.UPDATE_PROFILE, name },
    ResType.UPDATED_PROFILE,
  )
}

export class ProtocolError extends Error {
  public readonly type: ErrType

  public constructor(type: ErrType) {
    super(ErrType[type])
    this.name = this.constructor.name
    this.type = type
  }
}

function sendAndWaitFor(req: Req, type: ResType): Promise<Res> {
  socket.send(req)
  return new Promise((resolve, reject) => {
    socket.addCallback(callback)
    function callback(res: Res): void {
      if (res.type === type) {
        socket.removeCallback(callback)
        resolve(res)
      } else if (res.type === ResType.ERROR) {
        socket.removeCallback(callback)
        reject(new ProtocolError(res.error))
      }
    }
  })
}
