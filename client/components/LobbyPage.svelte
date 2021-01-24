<script lang="ts">
  import Editable from './Editable.svelte'
  import type { Board } from '../Board'
  import socket from '../socket'
  import { RequestType } from '../../game/protocol'

  export let boards: Board[]
  export let selfId: number

  function startGame(): void {
    socket.send({ type: RequestType.START_GAME })
  }

  function setName(e: CustomEvent): void {
    const name = e.detail.text
    if (name.length >= 3 && name.length <= 12) {
      socket.send({ type: RequestType.UPDATE_PROFILE, name })
      try {
        localStorage.setItem('name', name)
      } catch {
        // It might throw on exceeded quota or if disabled
        // We'll politely ignore, as the gentlemen we are
      }
    }
  }
</script>

<div>
  <h1>Room Lobby</h1>
  <p>Invite your friends by sharing this page's URL!</p>
  <ul>
    {#each boards as board, id (board)}
      <li>
        {#if id !== selfId}
          {board.name}
        {:else}
          <Editable
            message="Enter a new name (3 to 12 characters long):"
            on:edit={setName}
          >
            <b>{board.name}</b>
          </Editable>
        {/if}
      </li>
    {/each}
  </ul>
  <button on:click={startGame}>Start</button>
</div>
