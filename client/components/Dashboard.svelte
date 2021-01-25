<script lang="ts">
  import LoadingPage from './LoadingPage.svelte';
  import LeaderboardPage from './LeaderboardPage.svelte'
  import { page } from '../store'
  import socket from '../socket'
  import { RequestType } from '../../game/protocol'

  export let menu: boolean

  function joinRoom(): void {
    $page = LoadingPage
    socket.send({ type: RequestType.JOIN_ROOM })
  }

  function createRoom(): void {
    $page = LoadingPage
    socket.send({ type: RequestType.CREATE_ROOM })
  }

  function getScores(): void {
    $page = LeaderboardPage
  }
</script>

<style>
  nav {
    flex: 0 1 800px;
    padding: 0 8px;
    display: flex;
    align-items: baseline;
    border-bottom-left-radius: var(--rounded);
    border-bottom-right-radius: var(--rounded);
  }

  nav > * {
    margin: 0 6px;
  }

  .title {
    flex: 1;
  }

  .action:hover {
    text-decoration: underline;
    cursor: pointer;
  }
</style>

<nav>
  <h1 class="title action" on:click={joinRoom}>TETURISU!</h1>
  {#if menu}
    <div class="action" on:click={createRoom}>Create room</div>
    <div class="action" on:click={getScores}>Highscores</div>
  {/if}
</nav>
