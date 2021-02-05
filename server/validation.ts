import { Req, ReqType, Input, Move } from '../game/protocol.ts'

export function validateRequest(req: Req): void {
  if (!Number.isSafeInteger(req.type)) {
    throw new TypeError('type is not an integer')
  }

  switch (req.type) {
    case ReqType.JOIN_ROOM:
      if (typeof req.id !== 'string') {
        throw new TypeError('id is not a string')
      } else if (!/[A-Za-z0-9\-_]{12}/.test(req.id)) {
        throw new TypeError('id is not a 12-characters base64 string')
      }
      break

    case ReqType.CREATE_ROOM:
      break // Nothing to check

    case ReqType.LEAVE_ROOM:
      break // Nothing to check

    case ReqType.START_GAME:
      break // Nothing to check

    case ReqType.SEND_INPUTS:
      if (!Array.isArray(req.inputs)) {
        throw new TypeError('inputs is not an array')
      } else {
        req.inputs.forEach(validateInput)
      }
      break

    case ReqType.SUBMIT_SCORE:
      break // Nothing to check

    case ReqType.GET_HIGHSCORES:
      if (req.page !== undefined) {
        if (!Number.isSafeInteger(req.page)) {
          throw new TypeError('page is not an integer')
        } else if (req.page < 0 || req.page > 99) {
          throw new TypeError('page is not in range [0..99]')
        }
      }
      break

    case ReqType.UPDATE_PROFILE:
      if (typeof req.name !== 'string') {
        throw new TypeError('name is not a string')
      } else if (req.name.length < 3 || req.name.length > 12) {
        throw new TypeError('name is not 3-12 characters long')
      }
      break

    default:
      throw new TypeError('type is unknown')
  }
}

function validateInput(input: Input): void {
  if (!Array.isArray(input)) {
    throw new TypeError('input is not an array')
  } else if (input.length !== 2) {
    throw new TypeError('input is not 2-items long')
  } else if (!Number.isSafeInteger(input[0])) {
    throw new TypeError('move is not an integer')
  } else if (input[0] < 0 || input[0] >= Move.COUNT) {
    throw new TypeError('move is unknown')
  } else if (!Number.isSafeInteger(input[1])) {
    throw new TypeError('frame is not an integer')
  } else if (input[1] < 0 || input[1] > 216000) {
    throw new TypeError('frame is not in range [0..216000]')
  }
}
