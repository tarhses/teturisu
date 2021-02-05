<div class="box">
  <div class="indicator" />
  <h2>Please wait</h2>
</div>

<style>
  .box {
    display: flex;
    align-items: center;
  }

  .indicator {
    width: 32px;
    height: 4px;
    margin-right: 12px;
    border-radius: 6px;
    background-color: currentColor;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
