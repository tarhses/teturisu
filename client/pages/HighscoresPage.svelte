<script lang="ts">
  import { onMount } from 'svelte'
  import { leaveRoom, getHighscores } from '../protocol'
  import LoadingIndicator from '../components/LoadingIndicator.svelte'
  import ErrorIndicator from '../components/ErrorIndicator.svelte'

  let page = 0

  onMount(leaveRoom)
</script>

<div>
  <h1>Highscores</h1>
  {#await getHighscores(page)}
    <LoadingIndicator />
  {:then scores}
    {#if scores.length > 0}
      <ol start={page * scores.length + 1}>
        {#each scores as { name, score, timestamp }}
          <li>{name}: {score} at {timestamp}</li>
        {/each}
      </ol>
      {#if page > 0}
        <button on:click={() => page -= 1}>Previous</button>
      {/if}
      {#if page < 99}
        <button on:click={() => page += 1}>Next</button>
      {/if}
    {:else}
      <p>No score available.</p>
    {/if}
  {:catch err}
    <ErrorIndicator type={err.type} />
  {/await}
</div>
