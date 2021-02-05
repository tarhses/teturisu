<script lang="ts">
  import { onMount } from 'svelte'
  import EditableName from './EditableName.svelte'
  import { submitScore } from '../protocol'
  import { Renderer } from '../Renderer'
  import Piece from '../icons/Piece.svelte'
  import type { Game } from '../../game/Game'

  const FRAME = 1000 / 60

  export let host = false
  export let game: Game
  export let name: string
  let width: number
  export let height: number
  let score = game.score
  let next = game.nextPiece
  let canvas: HTMLCanvasElement

  $: width = (height - 8) / 2

  onMount(() => {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    const renderer = new Renderer(game, context)

    let last = performance.now()

    let frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)

    function update(t: number): void {
      frame = requestAnimationFrame(update)

      const done = game.over
      while (t >= last + FRAME) {
        game.handleFrame()
        last += FRAME
      }

      if (score !== game.score) {
        score = game.score
      }

      if (next !== game.nextPiece) {
        next = game.nextPiece
      }

      if (host && !done && game.over) {
        submitScore()
      }

      renderer.render()
    }
  })
</script>

<div class="box">
  <div class="header" style={`max-width: ${width}px`}>
    <div>
      {#if host}
        <EditableName {name} />
      {:else}
        <div>{name}</div>
      {/if}
      <div>{score}</div>
    </div>
    {#if host}
      <Piece type={next} />
    {/if}
  </div>
  <canvas class="board" bind:this={canvas} {width} {height} />
</div>

<style>
  .box {
    margin: 3px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
  }

  .board {
    border: 4px solid black;
    border-radius: var(--rounded);
  }
</style>
