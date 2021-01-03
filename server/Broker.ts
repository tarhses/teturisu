import { Room } from './Room.ts'

export class Broker {
  #rooms: Map<string, Room> = new Map()
  #main: Room

  public constructor() {
    this.#main = this.newRoom('main')
    this.#main.start()
  }

  public newRoom(id?: string): Room {
    const room = new Room(id)
    this.#rooms.set(room.id, room)
    return room
  }

  public getRoom(id?: string): Room {
    if (id === undefined) {
      return this.#main
    } else {
      return this.#rooms.get(id) ?? this.#main
    }
  }
}
