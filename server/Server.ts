import { Room } from './Room.ts'
import { Leaderboard } from './Leaderboard.ts'
import { Score } from '../game/protocol.ts'

export class Server {
  #rooms: Map<string, Room> = new Map()
  #scores: Leaderboard

  public constructor(database?: string) {
    this.#scores = new Leaderboard(database)
  }

  public newRoom(): Room {
    const room = new Room(this)
    this.#rooms.set(room.id, room)
    return room
  }

  public getRoom(id?: string): Room {
    let room: Room | undefined
    if (id !== undefined) {
      room = this.#rooms.get(id)
    }

    if (room === undefined) {
      // TODO: create or get a public room
      room = this.newRoom()
    }

    return room
  }

  public deleteRoom(id: string): void {
    const success = this.#rooms.delete(id)
    console.assert(success)
  }

  public getScores(page?: number): Score[] {
    return this.#scores.getScores(page)
  }
}
