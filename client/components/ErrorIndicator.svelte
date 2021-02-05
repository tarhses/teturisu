<script lang="ts">
  import { ErrType } from '../../game/protocol'
  export let type: ErrType
</script>

<div class="alert">
  {#if type === ErrType.NONEXISTENT_ROOM}
    <span>This room does not exist, sorry.</span>
  {:else if type === ErrType.FULL_ROOM}
    <span>This room is full. You can't join it, sorry.</span>
  {:else}
    <span>An unknown error has occured, please try again.</span>
  {/if}
</div>

<style>
  .alert {
    padding: 8px;
    border: 4px solid #dd2212;
    border-radius: var(--rounded);
    color: #ffffff;
    background-color: #dd2212;
    font-weight: bold;
  }
</style>
