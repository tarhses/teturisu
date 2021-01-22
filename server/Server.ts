import { Room } from './Room.ts'

export class Server {
  #rooms: Map<string, Room> = new Map()

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
}
