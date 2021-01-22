<script lang="ts">
  import { onMount } from 'svelte'
  import { Board } from './Board'
  import socket from './socket'
  import { getKeyDown, getKeyUp } from './constants'
  import type { Response } from '../game/protocol'
  import { RequestType, ResponseType } from '../game/protocol'
  import BoardPool from './components/BoardPool.svelte'

  let started = false
  let selfId: number
  let seed: number
  let boards: Board[] = []

  onMount(() => {
    const playerName = localStorage.getItem('name')
    if (playerName !== null) {
      socket.send({ type: RequestType.UPDATE_PROFILE, name: playerName })
    }

    const roomId = location.pathname.replace('/', '')
    socket.send(roomId.length === 0
      ? { type: RequestType.JOIN_ROOM }
      : { type: RequestType.JOIN_ROOM, id: roomId })

    function handleKeyDown(e: KeyboardEvent) {
      const self = boards[selfId]
      const move = getKeyDown(e.code)
      if (self !== undefined && move !== null) {
        self.handleMove(move)
        socket.send({
          type: RequestType.SEND_INPUT,
          inputs: [[move, self.frame]]
        })
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      const self = boards[selfId]
      const move = getKeyUp(e.code)
      if (self !== undefined && move !== null) {
        self.handleMove(move)
        socket.send({
          type: RequestType.SEND_INPUT,
          inputs: [[move, self.frame]]
        })
      }
    }

    function handleResponse(res: Response): void {
      switch (res.type) {
        case ResponseType.JOINED_ROOM:
          started = res.started
          selfId = res.players.length - 1
          seed = res.seed
          boards = res.players.map(player => new Board(seed, player))
          history.pushState(null, res.id, res.id)
          break

        case ResponseType.ADDED_PLAYER:
          boards = [...boards, new Board(seed, { name: res.name, frame: 0, inputs: [] })]
          break

        case ResponseType.REMOVED_PLAYER:
          boards = boards.filter((_, id) => id !== res.id)
          if (selfId > res.id) {
            selfId -= 1
          }
          break

        case ResponseType.STARTED_GAME:
          started = true
          break

        case ResponseType.RECEIVED_INPUT:
          for (const [id, inputs] of res.inputs.entries()) {
            if (id !== selfId) {
              boards[id].handleInputs(inputs)
            }
          }
          break

        case ResponseType.UPDATED_PROFILE:
          boards[res.id].name = res.name
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    socket.addCallback(handleResponse)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      socket.removeCallback(handleResponse)
    }
  })
</script>

<style>
  .container {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    background-color: #111;
  }
</style>

<button on:click={() => { socket.send({ type: RequestType.CREATE_ROOM }) }}>New room</button>
{#if !started}
  <h1>TETURISU!</h1>
  <p>Waiting to start...</p>
  <button on:click={() => { socket.send({ type: RequestType.START_GAME }) }}>Start</button>
{:else}
  <div class="container">
    <BoardPool boards={boards.filter((_, id) => selfId === id)} />
    <BoardPool boards={boards.filter((_, id) => selfId !== id)} />
  </div>
{/if}
