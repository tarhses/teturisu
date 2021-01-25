<script lang="ts">
  import { onMount } from 'svelte'
  import socket from '../socket'
  import type { Response, Score } from '../../game/protocol'
  import { RequestType, ResponseType } from '../../game/protocol'

  let scores: Score[] = []

  onMount(() => {
    socket.send({ type: RequestType.GET_SCORES })

    function handleResponse(res: Response): void {
      if (res.type === ResponseType.GOT_SCORES) {
        scores = res.scores
      }
    }

    socket.addCallback(handleResponse)
    return () => socket.addCallback(handleResponse)
  })
</script>

<h1>Highscores</h1>
<ol>
  {#each scores as { name, score }}
    <li><b>{name}</b>: {score}</li>
  {:else}
    <p>No score available.</p>
  {/each}
</ol>
