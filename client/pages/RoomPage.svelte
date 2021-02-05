<script lang="ts">
  import { onMount } from 'svelte'
  import GamePage from './GamePage.svelte'
  import LobbyPage from './LobbyPage.svelte'
  import socket from '../socket'
  import type { RoomInfo } from '../protocol'
  import LoadingIndicator from '../components/LoadingIndicator.svelte'
  import ErrorIndicator from '../components/ErrorIndicator.svelte'
  import type { Res } from '../../game/protocol'
  import { ResType, ErrType } from '../../game/protocol'
  import { Game } from '../../game/Game'
  import { BufferedGame } from '../../game/BufferedGame'

  interface State {
    started: boolean
    seed: number
    names: string[]
    games: Game[]
    selfId: number
  }

  export let promise: Promise<RoomInfo>
  let state: State | undefined = undefined
  let error: ErrType | undefined = undefined
  export let maxHeight: number

  onMount(async () => {
    try {
      const { id, seed, started, players } = await promise
      const selfId = players.length - 1
      state = {
        started,
        seed,
        names: players.map(player => player.name),
        games: players.map((player, id) => {
          if (id === selfId) {
            return new Game(seed)
          } else {
            const game = new BufferedGame(seed)
            for (const input of player.inputs) {
              game.handleInput(input)
            }
            while (!game.over && game.frame < player.frame) {
              game.handleFrame()
            }
            return game
          }
        }),
        selfId,
      }
      history.pushState(null, '', id)
    } catch (err) {
      error = err.type
    }
  })

  onMount(() => {
    socket.addCallback(handleRes)
    return () => socket.removeCallback(handleRes)

    function handleRes(res: Res): void {
      if (state === undefined) {
        return
      }

      switch (res.type) {
        case ResType.ADDED_PLAYER:
          state.games = [...state.games, new BufferedGame(state.seed)]
          state.names = [...state.names, res.name]
          break

        case ResType.REMOVED_PLAYER:
          state.games = state.games.filter((_, id) => id !== res.id)
          state.names = state.names.filter((_, id) => id !== res.id)
          if (state.selfId > res.id) {
            state.selfId -= 1
          }
          break

        case ResType.STARTED_GAME:
          state.started = true
          break

        case ResType.SEND_INPUTS:
          for (const [id, buffer] of res.inputs.entries()) {
            if (id !== state.selfId) {
              for (const input of buffer) {
                state.games[id].handleInput(input)
              }
            }
          }
          break

        case ResType.UPDATED_PROFILE:
          state.names[res.id] = res.name
          break
      }
    }
  })
</script>

{#if state === undefined}
  {#if error === undefined}
    <LoadingIndicator />
  {:else}
    <ErrorIndicator type={error} />
  {/if}
{:else}
  {#if state.started}
    <GamePage
      {maxHeight}
      names={state.names}
      games={state.games}
      selfId={state.selfId}
    />
  {:else}
    <LobbyPage
      names={state.names}
      selfId={state.selfId}
    />
  {/if}
{/if}
