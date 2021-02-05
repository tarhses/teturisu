<script lang="ts">
  import { startGame } from '../protocol'
  import EditableName from '../components/EditableName.svelte'

  export let names: string[]
  export let selfId: number
</script>

<div>
  <h1>Room Lobby</h1>
  <p>Invite your friends by sharing this page's URL!</p>
  <ul>
    {#each names as name, id}
      {#if id === selfId}
        <li><EditableName {name} /></li>
      {:else}
        <li>{name}</li>
      {/if}
    {/each}
  </ul>
  <button on:click={startGame}>Start</button>
</div>
