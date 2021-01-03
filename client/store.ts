import { writable } from 'svelte/store'
import socket from './socket'
import { RequestType } from '../game/protocol'

function createName() {
  const name = localStorage.getItem('name') ?? 'Anonymous'
  const { subscribe, set } = writable(name)
  return {
    subscribe,
    set(name: string): void {
      set(name)
      socket.send({ type: RequestType.UPDATE_PROFILE, playerName: name })
      try {
        localStorage.setItem('name', name)
      } catch {
        // Could throw on exceeded quota or disabled local storage
        // We'll ignore as gentlemen ;)
      }
    }
  }
}

export const name = createName()
