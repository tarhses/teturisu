<script lang="ts">
  import GameCanvas from './GameCanvas.svelte'
  import type { Board } from '../Board'
  import type { KeyHandler } from '../control'
  import { down, up } from '../control'
  import socket from '../socket'
  import { RequestType } from '../../game/protocol'

  export let boards: Board[]
  export let selfId: number

  const handleKey = (handle: KeyHandler) => function(e: KeyboardEvent): void {
    const move = handle(e.code)
    if (move !== null) {
      const self = boards[selfId]
      self.handleMove(move)
      socket.send({
        type: RequestType.SEND_INPUT,
        inputs: [[move, self.frame]]
      })
    }
  }
</script>

<svelte:window on:keydown={handleKey(down)} on:keyup={handleKey(up)} />
{#each boards as board (board)}
  <GameCanvas {board} width={100} />
{/each}
