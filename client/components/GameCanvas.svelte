<script lang="ts">
  import { onMount } from 'svelte'
  import type { Board } from '../Board'
  import { renderBoard } from '../render'
  import Piece from '../icons/Piece.svelte'
  import { TICK } from '../../game/constants'

  export let board: Board
  export let width: number
  export let host = false

  let canvas: HTMLCanvasElement

  // These three are updated by the Game object itself, we must introduce local
  // variables for Svelte to know when to change them.
  // This is kind of a hack, but it's worth it ;).
  let level = board.level
  let score = board.score
  let next = board.nextPiece

  onMount(() => {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    let lastTick = performance.now()
    let frame = requestAnimationFrame(handleFrame)

    function handleFrame(tick: number): void {
      frame = requestAnimationFrame(handleFrame)

      while (tick >= lastTick + TICK) {
        board.handleTick()
        lastTick += TICK
      }

      if (level !== board.level) {
        level = board.level
      }

      if (score !== board.score) {
        score = board.score
      }

      if (next !== board.nextPiece) {
        next = board.nextPiece
      }

      renderBoard(board, context)
    }

    return () => cancelAnimationFrame(frame)
  })
</script>

<style>
  .box {
    margin: 4px;
  }

  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  canvas {
    border: 4px solid black;
    border-radius: 4px;
  }
</style>

<div class="box">
  <div class="info">
    <div>
      <div>{board.name}</div>
      <div>Level {level + 1}</div>
      <div>{score}</div>
    </div>
    {#if host}
      <Piece type={next} size="24pt" />
    {/if}
  </div>
  <canvas
    bind:this={canvas}
    {width}
    height={width * 2 + 4}
  />
</div>
