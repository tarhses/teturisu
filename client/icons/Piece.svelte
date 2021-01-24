<script lang="ts">
  export let type: number
  export let size: number | string = '24pt'
</script>

<svg height={size} viewBox="0 0 8 4">
  {#if type === 0}
    <polygon points="0,1 8,1 8,3 0,3" fill="currentColor" />
  {:else if type === 1}
    <polygon points="1,0 3,0 3,2 7,2 7,4 1,4" fill="currentColor" />
  {:else if type === 2}
    <polygon points="1,2 5,2 5,0 7,0 7,4 1,4" fill="currentColor" />
  {:else if type === 3}
    <rect x="2" y="0" width="4" height="4" fill="currentColor" />
  {:else if type === 4}
    <polygon points="1,2 3,2 3,0 7,0 7,2 5,2 5,4 1,4" fill="currentColor" />
  {:else if type === 5}
    <polygon points="1,2 3,2 3,0 5,0 5,2 7,2 7,4 1,4" fill="currentColor" />
  {:else}
    <polygon points="1,0 5,0 5,2 7,2 7,4 3,4 3,2 1,2" fill="currentColor" />
  {/if}
</svg>
