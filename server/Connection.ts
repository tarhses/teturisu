import { Server } from './Server.ts'
import { Room } from './Room.ts'
import { Session } from './Session.ts'
import { Sender } from './Sender.ts'
import { Req, ReqType, ResType, Err } from '../game/protocol.ts'

export class Connection {
  #server: Server
  #name: string = 'Anonymous'
  #session?: Session
  #sender: Sender

  public constructor(server: Server, sender: Sender) {
    this.#server = server
    this.#sender = sender
  }

  public disconnect(): void {
    this.#session?.leave()
  }

  public handleRequest(req: Req): void {
    switch (req.type) {
      case ReqType.JOIN_ROOM: this.handleJoinRequest(req.id); break
      case ReqType.LEAVE_ROOM: this.handleLeaveRequest(); break
      case ReqType.CREATE_ROOM: this.handleCreateRequest(); break
      case ReqType.GET_HIGHSCORES: this.handleHighscoresRequest(req.page); break
      case ReqType.UPDATE_PROFILE: this.handleProfileUpdateRequest(req.name); break
    }

    this.#session?.handleRequest(req)
  }

  private handleJoinRequest(id?: string): void {
    if (this.#session !== undefined) {
      this.leave()
    }

    const room = id === undefined
      ? this.#server.getPublicRoom()
      : this.#server.getPrivateRoom(id)

    if (room === undefined) {
      this.#sender.sendErr(Err.NON_EXISTENT_ROOM)
    } else if (room.full) {
      this.#sender.sendErr(Err.FULL_ROOM)
    } else {
      this.join(room)
    }
  }

  private handleLeaveRequest(): void {
    if (this.#session === undefined) {
      this.#sender.sendErr(Err.INVALID_REQUEST)
    } else {
      this.leave()
    }
  }

  private handleCreateRequest(): void {
    if (this.#session !== undefined) {
      this.leave()
    }

    this.join(this.#server.newRoom())
  }

  private handleHighscoresRequest(page?: number): void {
    this.#sender.sendRes({
      type: ResType.GOT_HIGHSCORES,
      scores: [], // TODO
    })
  }

  private handleProfileUpdateRequest(name: string): void {
    this.#name = name
  }

  private join(room: Room): void {
    console.assert(this.#session === undefined, 'joining without leaving')
    this.#session = new Session(this.#name, room, this.#sender)

    this.#sender.sendRes({
      type: ResType.JOINED_ROOM,
      id: room.id,
      seed: room.seed,
      started: room.started,
      players: room.players,
    })
  }

  private leave(): void {
    if (this.#session === undefined) {
      console.assert(false, 'leaving without joining')
    } else {
      this.#session.leave()
      this.#session = undefined
      this.#sender.sendRes({ type: ResType.LEFT_ROOM })
    }
  }
}
