// TODO: clients shouldn't submit scores, the server should detect game overs.
// That implies that the server's architecture should be revised... yay

export enum RequestType {
  CREATE_ROOM,
  JOIN_ROOM,
  START_GAME,
  SEND_INPUT,
  UPDATE_PROFILE,
  SUBMIT_SCORE,
  GET_SCORES,
  COUNT // Keep last
}

export enum ResponseType {
  JOINED_ROOM,
  ADDED_PLAYER,
  REMOVED_PLAYER,
  STARTED_GAME,
  RECEIVED_INPUT,
  UPDATED_PROFILE,
  SUBMITTED_SCORE,
  GOT_SCORES,
  COUNT // Keep last
}

export type Request =
  { type: RequestType.CREATE_ROOM } |
  { type: RequestType.JOIN_ROOM, id?: string } |
  { type: RequestType.START_GAME } |
  { type: RequestType.SEND_INPUT, inputs: Input[] } |
  { type: RequestType.UPDATE_PROFILE, name: string } |
  { type: RequestType.SUBMIT_SCORE, score: number, frame: number } |
  { type: RequestType.GET_SCORES, page?: number }

export type Response =
  { type: ResponseType.JOINED_ROOM, id: string, seed: number, started: boolean, players: Player[] } |
  { type: ResponseType.ADDED_PLAYER, name: string } |
  { type: ResponseType.REMOVED_PLAYER, id: number } |
  { type: ResponseType.STARTED_GAME } |
  { type: ResponseType.RECEIVED_INPUT, inputs: Input[][] } |
  { type: ResponseType.UPDATED_PROFILE, id: number, name: string } |
  { type: ResponseType.GOT_SCORES, scores: Score[] }

export type Input = [Move, number]

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

export interface Player {
  name: string
  frame: number
  inputs: Input[]
}

export interface Score {
  name: string
  score: number
  timestamp: number
}
