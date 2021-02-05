<script lang="ts">
  import { updateProfile } from '../protocol'
  import Pencil from '../icons/Pencil.svelte'

  export let name: string
  let value = ''
  let editing = false
  let input: HTMLInputElement

  $: if (input != null) {
    input.select()
  }

  function focus(): void {
    value = name
    editing = true
  }

  function blur(): void {
    editing = false
    try {
      updateProfile(value)
      localStorage.setItem('name', value)
    } catch {
      // Ignore errors
    }
  }
</script>

{#if editing}
  <form on:submit|preventDefault={blur}>
    <input bind:this={input} bind:value on:blur={blur} required minlength="3" maxlength="12">
  </form>
{:else}
  <div class="clickable" on:click={focus}>
    {name}
    <Pencil />
  </div>
{/if}

<style>
  .clickable:hover {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
