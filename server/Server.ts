import { Room } from './Room.ts'
import { Leaderboard } from './Leaderboard.ts'
import { Score } from '../game/protocol.ts'

export class Server {
  #rooms: Map<string, Room> = new Map()
  #public: Room | null = null
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
      if (this.#public === null || this.#public.nPlayers >= 32) {
        this.#public = this.newRoom()
        this.#public.start()
      }

      room = this.#public
    }

    return room
  }

  public deleteRoom(id: string): void {
    const success = this.#rooms.delete(id)
    console.assert(success)

    if (this.#public !== null && id === this.#public.id) {
      this.#public = null
    }
  }

  public getScores(page?: number): Score[] {
    return this.#scores.getScores(page)
  }

  public addScore(name: string, score: number): void {
    this.#scores.addScore(name, score)
  }
}
