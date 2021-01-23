<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let message: string

  const dispatch = createEventDispatcher()

  function edit(): void {
    const text = prompt(message) ?? ''
    dispatch('edit', { text: text.trim() })
  }
</script>

<style>
  .editable {
    cursor: pointer;
  }

  .editable:hover {
    text-decoration: underline;
  }
</style>

<div class="editable" on:click={edit}>
  <slot />
  <svg width="12pt" height="12pt" viewBox="0 0 8 8" transform="rotate(45)">
    <polygon points="4,8 3,6 3,2.5 5,2.5 5,6" fill="currentColor" />
    <rect x="3" y="0" width="2" height="2" fill="currentColor" />
  </svg>
</div>
