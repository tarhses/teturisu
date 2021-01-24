<script lang="ts">
  import Dashboard from './Dashboard.svelte'
  export let menu: boolean
</script>

<style>
  .box {
    height: 100%;
    margin: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  header {
    align-self: stretch;
    display: flex;
    justify-content: center;
  }

  main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<div class="box">
  <header>
    <Dashboard {menu} />
  </header>
  <main>
    <slot />
  </main>
  <footer>
    <small>&copy; 2021, Pierre Luycx</small>
  </footer>
</div>
