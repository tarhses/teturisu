<script lang="ts">
  import GameCanvas from './GameCanvas.svelte'
  import type { Board } from '../Board'
  import type { KeyHandler } from '../control'
  import { down, up } from '../control'
  import socket from '../socket'
  import { RequestType } from '../../game/protocol'

  export let boards: Board[]
  export let selfId: number

  const self = boards[selfId]

  const handleKey = (handle: KeyHandler) => function(e: KeyboardEvent): void {
    const move = handle(e.code)
    if (move !== null) {
      e.preventDefault() // avoid scrolling, or any weird shortcuts
      self.handleMove(move)
      socket.send({
        type: RequestType.SEND_INPUT,
        inputs: [[move, self.frame]]
      })
    }
  }
</script>

<style>
  .others {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>

<svelte:window
  on:keydown={handleKey(down)}
  on:keyup={handleKey(up)}
/>
<div class="self">
  <GameCanvas board={self} width={300} host />
</div>
<div class="others">
  {#each boards as board (board)}
    {#if board !== self}
      <GameCanvas {board} width={100} />
    {/if}
  {/each}
</div>
