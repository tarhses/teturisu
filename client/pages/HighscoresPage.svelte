<script lang="ts">
  import { onMount } from 'svelte'
  import { leaveRoom, getHighscores } from '../protocol'
  import LoadingIndicator from '../components/LoadingIndicator.svelte'
  import ErrorIndicator from '../components/ErrorIndicator.svelte'

  let page = 0

  onMount(async () => {
    try {
      await leaveRoom()
    } catch {
      // We weren't in a room, no big deal
    }
  })
</script>

<div>
  <h1>Highscores</h1>
  {#await getHighscores(page)}
    <LoadingIndicator />
  {:then scores}
    {#if scores.length > 0}
      <ol class="list" start={page * scores.length + 1}>
        {#each scores as { name, score, timestamp }}
          <li>
            <b>{name}</b>:
            {score}
            <small><i>({new Date(timestamp).toLocaleDateString()})</i></small>
          </li>
        {/each}
      </ol>
    {:else}
      <p><i>No score available.</i></p>
    {/if}
    {#if page > 0}
      <button on:click={() => page -= 1}>Previous page</button>
    {/if}
    {#if scores.length > 0 && page < 99}
      <button on:click={() => page += 1}>Next page</button>
    {/if}
  {:catch err}
    <ErrorIndicator type={err.type} />
  {/await}
</div>

<style>
  .list {
    padding-left: 0;
  }
</style>
