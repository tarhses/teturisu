<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Pencil from '../icons/Pencil.svelte'

  export let message: string

  const dispatch = createEventDispatcher()

  function edit(): void {
    const text = prompt(message) ?? ''
    dispatch('edit', { text: text.trim() })
  }
</script>

<style>
  .editable:hover {
    text-decoration: underline;
    cursor: pointer;
  }
</style>

<div class="editable" on:click={edit}>
  <slot />
  <Pencil size="12pt" />
</div>
