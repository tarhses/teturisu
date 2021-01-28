export enum ReqType {
  JOIN_ROOM,
  LEAVE_ROOM,
  CREATE_ROOM,
  START_GAME,
  SEND_INPUTS,
  GET_HIGHSCORES,
  UPDATE_PROFILE,
}

export type Req =
  { type: ReqType.JOIN_ROOM, id?: string } |
  { type: ReqType.LEAVE_ROOM } |
  { type: ReqType.CREATE_ROOM } |
  { type: ReqType.START_GAME } |
  { type: ReqType.SEND_INPUTS, inputs: Input[] } |
  { type: ReqType.GET_HIGHSCORES, page?: number } |
  { type: ReqType.UPDATE_PROFILE, name: string }

export enum ResType {
  JOINED_ROOM,
  LEFT_ROOM,
  ADDED_PLAYER,
  REMOVED_PLAYER,
  STARTED_GAME,
  SEND_INPUTS,
  GOT_HIGHSCORES,
  UPDATED_PROFILE,
}

export type Res =
  { type: ResType.JOINED_ROOM, id: string, seed: number, started: boolean, players: Player[] } |
  { type: ResType.LEFT_ROOM } |
  { type: ResType.ADDED_PLAYER, name: string } |
  { type: ResType.REMOVED_PLAYER, id: number } |
  { type: ResType.STARTED_GAME } |
  { type: ResType.SEND_INPUTS, inputs: Input[][] } |
  { type: ResType.GOT_HIGHSCORES, scores: Highscore[] } |
  { type: ResType.UPDATED_PROFILE, id: number, name: string }

export enum Err {
  INVALID_REQUEST,
  NON_EXISTENT_ROOM,
  FULL_ROOM,
}

export type Input = [Move, number]

export enum Move {
  LEFT_SHIFT,
  RIGHT_SHIFT,
  LEFT_ROTATION,
  RIGHT_ROTATION,
  HARD_DROP,
  SOFT_DROP_START,
  SOFT_DROP_END,
}

export interface Player {
  name: string
  frame: number
  inputs: Input[]
}

export interface Highscore {
  name: string
  score: number
  timestamp: number
}
