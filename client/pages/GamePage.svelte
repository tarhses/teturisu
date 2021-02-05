<script lang="ts">
  import { sendInputs } from '../protocol'
  import type { KeyHandler } from '../keyboard'
  import { keyDown, keyUp } from '../keyboard'
  import GameCanvas from '../components/GameCanvas.svelte'
  import type { Game } from '../../game/Game'

  export let maxHeight: number
  export let names: string[]
  export let games: Game[]
  export let selfId: number

  const self = games[selfId]

  const handleKey = (handle: KeyHandler) => (e: KeyboardEvent): void => {
    const move = handle(e.code)
    if (move !== undefined && self.handleMove(move)) {
      sendInputs([[move, self.frame]])
    }
  }
</script>

<svelte:window
  on:keydown={handleKey(keyDown)}
  on:keyup={handleKey(keyUp)}
/>
<div class="self">
  <GameCanvas
    host
    game={self}
    name={names[selfId]}
    height={maxHeight * 0.65}
  />
</div>
<div class="others" style="max-height: {maxHeight}px">
  {#each games as game, id}
    {#if game !== self}
      <GameCanvas
        {game}
        name={names[id]}
        height={maxHeight * 0.35}
      />
    {/if}
  {/each}
</div>

<style>
  .others {
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
