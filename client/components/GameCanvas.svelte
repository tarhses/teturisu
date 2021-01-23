<script lang="ts">
  import { onMount } from 'svelte'
  import type { Board } from '../Board'
  import { renderBoard } from '../render'
  import { TICK_FRAMERATE } from '../../game/constants'

  export let board: Board
  export let width = 200

  let canvas: HTMLCanvasElement

  onMount(() => {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    let lastTick = performance.now()
    let frame = requestAnimationFrame(handleFrame)

    function handleFrame(tick: number): void {
      frame = requestAnimationFrame(handleFrame)

      while (tick >= lastTick + TICK_FRAMERATE) {
        board.handleTick()
        lastTick += TICK_FRAMERATE
      }

      renderBoard(board, context)
    }

    return () => cancelAnimationFrame(frame)
  })
</script>

<style>
  canvas {
    border: 4px solid black;
    border-radius: 4px;
  }
</style>

<canvas bind:this={canvas} {width} height={width * 2} />
