<script lang="ts">
  import { onMount } from 'svelte'
  import type { RoomInfo } from './protocol'
  import { updateProfile } from './protocol'
  import { joinPublicRoom, joinPrivateRoom, createRoom } from './protocol'
  import RoomPage from './pages/RoomPage.svelte'
  import HighscoresPage from './pages/HighscoresPage.svelte'

  const name = localStorage.getItem('name') ?? ''
  if (name.length > 0) {
    updateProfile(name)
  }

  let promise: Promise<RoomInfo> | undefined = fromPath()
  let main: HTMLElement
  let maxHeight = 0

  onMount(resized)

  function resized(): void {
    maxHeight = main.clientHeight
  }

  function fromPath(): Promise<RoomInfo> {
    const id = location.pathname.replace('/', '')
    return id.length > 0
      ? joinPrivateRoom(id)
      : joinPublicRoom()
  }
</script>

<svelte:window on:resize={resized} />
<div class="box">
  <header>
    <nav>
      <h1 class="title action" on:click={() => promise = joinPublicRoom()}>TETURISU!</h1>
      <div class="action" on:click={() => promise = createRoom()}>Create room</div>
      <div class="action" on:click={() => promise = undefined}>Highscores</div>
    </nav>
  </header>
  <main bind:this={main}>
    {#if promise === undefined}
      <HighscoresPage />
    {:else}
      {#key promise}
        <RoomPage {promise} {maxHeight} />
      {/key}
    {/if}
  </main>
  <footer>
    <small>&copy; Pierre Luycx, 2021 &mdash; v0.1.0</small>
  </footer>
</div>

<style>
  .box {
    height: 100%;
    margin: 0 8px;
    display: flex;
    flex-direction: column;
  }

  header, main, footer {
    display: flex;
    justify-content: center;
  }

  main {
    flex: 1;
    align-items: center;
  }

  nav {
    flex: 0 1 800px;
    display: flex;
    align-items: baseline;
  }

  .title {
    flex: 1;
  }

  .action {
    margin: 0 8px;
  }

  .action:hover {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
