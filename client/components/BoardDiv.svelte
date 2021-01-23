<script lang="ts">
  import { onMount } from 'svelte'
  import type { Board } from '../Board'
  import { PIECE_COLORS } from '../constants'
  import socket from '../socket'
  import { TICK_FRAMERATE } from '../../game/constants'
  import { RequestType } from '../../game/protocol';
  import Pencil from './Editable.svelte'

  export let board: Board
  export let width = 300
  let canvas: HTMLCanvasElement

  function handleNameEdition(): void {
    let name = prompt('Enter a new name (3-12 characters):')
    if (name !== null) {
      name = name.trim()
      if (name.length >= 3 && name.length <= 12) {
        socket.send({ type: RequestType.UPDATE_PROFILE, name })
        try {
          localStorage.setItem('name', name)
        } catch {
          // May throw on exceeded quota or if disabled
          // We'll politely ignore, as the gentlemen we are
        }
      }
    }
  }

  onMount(() => {
    const cellWidth = Math.floor(width / 10)
    const cellHeight = Math.floor(width * 2 / 20)
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    context.font = '12pt sans-serif'
    context.textBaseline = 'top'

    let lastTick = performance.now()
    let frame = requestAnimationFrame(handleFrame)

    function handleFrame(tick: number): void {
      frame = requestAnimationFrame(handleFrame)

      // Update
      while (tick >= lastTick + TICK_FRAMERATE) {
        board.handleTick()
        lastTick += TICK_FRAMERATE
      }

      // Grid
      context.fillStyle = 'black'
      context.fillRect(0, 0, canvas.width, canvas.height)

      for (let [x, y, cell] of board.cells()) {
        context.fillStyle = PIECE_COLORS[cell]
        context.fillRect(
          x * cellWidth,
          (19 - y) * cellHeight,
          cellWidth,
          cellHeight
        )
      }

      // Score
      context.fillStyle = '#ddd'
      context.fillText(`${board.score}`, 8, 8)

      // Next piece
      const cell = board.nextPiece + 1
      context.fillStyle = PIECE_COLORS[cell]
      context.fillRect(width - 8, 8, -16, 16)
    }

    return () => cancelAnimationFrame(frame)
  })
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 4px;
  }

  .header {
    font-family: sans-serif;
    font-size: 14pt;
    color: #ddd;
    cursor: pointer;
  }

  .board {
    margin-top: 8px;
    border: 8px solid black;
    border-radius: 8px;
  }
</style>

<div class="container">
  <div class="header" on:click={handleNameEdition}>
    {board.name}
    <Pencil size="16pt" />
  </div>
  <canvas
    bind:this={canvas}
    class="board"
    {width}
    height={width * 2}
  />
</div>
