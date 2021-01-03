<script lang="ts">
  import { onMount } from 'svelte'
  import { Board } from './Board'
  import socket from './socket'
  import { getKeyDown, getKeyUp } from './constants'
  import type { Response } from '../game/protocol'
  import { RequestType, ResponseType } from '../game/protocol'
  import BoardPool from './components/BoardPool.svelte'

  let selfId: number
  let seed: number
  let boards: Board[] = []

  onMount(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const board = boards[selfId]
      const move = getKeyDown(e.code)
      if (board !== undefined && move !== null) {
        board.handleMove(move)
        socket.send({
          type: RequestType.SEND_INPUT,
          inputs: [[move, board.frame]]
        })
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      const board = boards[selfId]
      const move = getKeyUp(e.code)
      if (board !== undefined && move !== null) {
        board.handleMove(move)
        socket.send({
          type: RequestType.SEND_INPUT,
          inputs: [[move, board.frame]]
        })
      }
    }

    function handleResponse(res: Response): void {
      console.log(res)
      switch (res.type) {
        case ResponseType.JOINED_ROOM:
          selfId = res.players.length - 1
          seed = res.seed
          boards = res.players.map(player => new Board(seed, player))
          break

        case ResponseType.ADDED_PLAYER:
          boards = [...boards, new Board(seed)]
          break

        case ResponseType.REMOVED_PLAYER:
          boards = boards.filter((_, id) => id !== res.playerId)
          if (selfId > res.playerId) {
            selfId -= 1
          }
          break

        case ResponseType.STARTED_GAME:
          break

        case ResponseType.RECEIVED_INPUT:
          for (const [id, inputs] of res.inputs.entries()) {
            if (id !== selfId) {
              boards[id].handleInputs(inputs)
            }
          }
          break

        case ResponseType.UPDATED_PROFILE:
          boards[res.playerId].name = res.playerName
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

<div class="container">
  <BoardPool boards={boards.filter((_, id) => selfId === id)} />
  <BoardPool boards={boards.filter((_, id) => selfId !== id)} />
</div>
