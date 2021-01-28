import { Room } from './Room.ts'
import { Leaderboard } from './Leaderboard.ts'

export class Server {
  #rooms: Map<string, Room> = new Map()
  #public?: Room
  #highscores: Leaderboard

  public constructor(highscores: Leaderboard) {
    this.#highscores = highscores
  }

  public newRoom(): Room {
    const room = new Room(this)
    this.#rooms.set(room.id, room)
    return room
  }

  public getPublicRoom(): Room {
    if (this.#public === undefined || this.#public.full) {
      this.#public = this.newRoom()
    }

    return this.#public
  }

  public getPrivateRoom(id: string): Room | undefined {
    return this.#rooms.get(id)
  }

  public deleteRoom(id: string): void {
    const deleted = this.#rooms.delete(id)
    console.assert(deleted, 'deleting unregistered room')

    if (id === this.#public?.id) {
      this.#public = undefined
    }
  }
}
