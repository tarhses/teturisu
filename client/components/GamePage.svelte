<script lang="ts">
  import type Board from '../Board'
  import { getKeyDown as down, getKeyUp as up } from '../constants'
  import type { Move } from '../../game/protocol';

  export let boards: Board[]

  const handleKey = (handle: (code: string) => Move | null) => function(e: KeyboardEvent): void {
    const move = handle(e.code)
    if (move !== null) {
      console.log(move)
    }
  }
</script>

<svelte:window on:keydown={handleKey(down)} on:keyup={handleKey(up)} />
