<script lang="ts">
  import socket from '../socket'
  import { RequestType } from '../../game/protocol'

  export let menu: boolean

  const actions = [
    {
      caption: 'Create room',
      execute(): void {
        socket.send({ type: RequestType.CREATE_ROOM })
      }
    },
    {
      caption: 'Highscores',
      execute(): void {
        // TODO
      }
    },
    {
      caption: 'About',
      execute(): void {
        // TODO
      }
    }
  ]
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
  <h1 class="title">TETURISU!</h1>
  {#if menu}
    {#each actions as { caption, execute }}
      <div class="action" on:click={execute}>{caption}</div>
    {/each}
  {/if}
</nav>
