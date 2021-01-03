<script lang="ts">
  import { onMount } from 'svelte'
  import type { Board } from '../Board'
  import { PIECE_COLORS } from '../constants'
  import { TICK_FRAMERATE } from '../../game/constants'

  export let board: Board
  const score = 120345

  let canvas: HTMLCanvasElement

  onMount(() => {
    const cellWidth = Math.floor(canvas.width / 10)
    const cellHeight = Math.floor(canvas.height / 20)
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    let lastTick = performance.now()
    let frame = requestAnimationFrame(handleFrame)

    function handleFrame(tick: number): void {
      frame = requestAnimationFrame(handleFrame)

      // Update
      while (tick >= lastTick + TICK_FRAMERATE) {
        board.handleTick()
        lastTick += TICK_FRAMERATE
      }

      // Render
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
    color: #ddd;
  }

  .board {
    margin-top: 4px;
    border: 8px solid black;
    border-radius: 8px;
  }
</style>

<div class="container">
  <div class="header">
    <div>{board.name}</div>
    <div>{score}</div>
  </div>
  <canvas
    bind:this={canvas}
    class="board"
    width={200}
    height={400}
  />
</div>
