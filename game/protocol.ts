export enum Move {
  LEFT_SHIFT,
  RIGHT_SHIFT,
  LEFT_ROTATION,
  RIGHT_ROTATION,
  HARD_DROP,
  START_SOFT_DROP,
  STOP_SOFT_DROP,
  COUNT // Keep last
}

export type Input = [Move, number]

export interface Player {
  name: string
  inputs: Input[]
  frame: number
}

export enum RequestType {
  CREATE_ROOM,
  JOIN_ROOM,
  START_GAME,
  SEND_INPUT,
  UPDATE_PROFILE,
  COUNT // Keep last
}

export type Request =
  { type: RequestType.CREATE_ROOM, playerName: string } |
  { type: RequestType.JOIN_ROOM, roomId: string, playerName: string } |
  { type: RequestType.START_GAME } |
  { type: RequestType.SEND_INPUT, inputs: Input[] } |
  { type: RequestType.UPDATE_PROFILE, playerName: string }

export enum ResponseType {
  JOINED_ROOM,
  ADDED_PLAYER,
  REMOVED_PLAYER,
  STARTED_GAME,
  RECEIVED_INPUT,
  UPDATED_PROFILE,
  COUNT // Keep last
}

export type Response =
  { type: ResponseType.JOINED_ROOM, roomId: string, players: Player[], started: number, seed: number } |
  { type: ResponseType.ADDED_PLAYER, playerName: string } |
  { type: ResponseType.REMOVED_PLAYER, playerId: number } |
  { type: ResponseType.STARTED_GAME } |
  { type: ResponseType.RECEIVED_INPUT, inputs: Input[][] } |
  { type: ResponseType.UPDATED_PROFILE, playerId: number, playerName: string }
