<script lang="ts">
  import type { Board } from '../Board'
  import BoardDiv from './BoardDiv.svelte'

  export let boards: Board[]
</script>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 8px 0;
    overflow-y: auto;
  }
</style>

<div class="container">
  {#each boards as board}
    <BoardDiv {board} />
  {/each}
</div>
