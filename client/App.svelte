<script lang="ts">
  import { onMount } from 'svelte'
  import { Board } from './Board'
  import socket from './socket'
  import Container from './components/Container.svelte'
  import LoadingPage from './components/LoadingPage.svelte'
  import LobbyPage from './components/LobbyPage.svelte'
  import GamePage from './components/GamePage.svelte'
  import type { Response } from '../game/protocol'
  import { RequestType, ResponseType } from '../game/protocol'

  let page: any = LoadingPage
  let seed: number
  let boards: Board[] = []
  let selfId: number

  onMount(() => {
    const playerName = localStorage.getItem('name')
    if (playerName !== null) {
      socket.send({ type: RequestType.UPDATE_PROFILE, name: playerName })
    }

    const roomId = location.pathname.replace('/', '')
    socket.send(roomId.length === 0
      ? { type: RequestType.JOIN_ROOM }
      : { type: RequestType.JOIN_ROOM, id: roomId })

    function handleResponse(res: Response): void {
      switch (res.type) {
        case ResponseType.JOINED_ROOM:
          page = res.started ? GamePage : LobbyPage
          seed = res.seed
          boards = res.players.map(player => new Board(seed, player))
          selfId = boards.length - 1
          history.pushState(null, '', res.id)
          break

        case ResponseType.ADDED_PLAYER:
          boards = [...boards, new Board(seed, {
            name: res.name,
            frame: 0,
            inputs: []
          })]
          break

        case ResponseType.REMOVED_PLAYER:
          boards = boards.filter((_, id) => id !== res.id)
          if (selfId > res.id) {
            selfId -= 1
          }
          break

        case ResponseType.STARTED_GAME:
          page = GamePage
          break

        case ResponseType.RECEIVED_INPUT:
          for (const [id, inputs] of res.inputs.entries()) {
            if (id !== selfId) {
              boards[id].handleInputs(inputs)
            }
          }
          break

        case ResponseType.UPDATED_PROFILE:
          boards[res.id].name = res.name
          break

        case ResponseType.GOT_SCORES:
          // TODO
          break
      }
    }

    socket.addCallback(handleResponse)
    return () => socket.removeCallback(handleResponse)
  })
</script>

<Container menu={page !== LoadingPage}>
  <svelte:component this={page} {boards} {selfId} />
</Container>
