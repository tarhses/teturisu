import { Move, Input, RequestType, Request } from '../game/protocol.ts'

export function validateRequest(req: Request): void {
  if (typeof req.type !== 'number') {
    throw new TypeError('invalid type (not a number)')
  }

  switch (req.type) {
    case RequestType.CREATE_ROOM:
      // Nothing to check
      break

    case RequestType.JOIN_ROOM:
      if (req.id !== undefined) {
        if (typeof req.id !== 'string') {
          throw new TypeError('invalid room ID (not a string)')
        } else if (!/^[A-Za-z0-9\-_]{12}$/.test(req.id)) {
          throw new TypeError('invalid room ID (not a 12 characters base64 string)')
        }
      }
      break

    case RequestType.START_GAME:
      // If the game already started, it will be ignored afterwards
      // Nothing to check thus
      break

    case RequestType.SEND_INPUT:
      if (!Array.isArray(req.inputs)) {
        throw new TypeError('invalid inputs (not an array)')
      } else if (req.inputs.length === 0) {
        throw new TypeError('invalid inputs (empty array)')
      } else {
        validateInputs(req.inputs)
      }
      break

    case RequestType.UPDATE_PROFILE:
      if (typeof req.name !== 'string') {
        throw new TypeError('invalid name (not a string)')
      } else if (req.name.length < 3 || req.name.length > 12) {
        throw new TypeError('invalid name (not a 3-12 characters string)')
      }
      break

    default:
      throw new TypeError('invalid request (unknown type)')
  }
}

function validateInputs(inputs: Input[]): void {
  for (const input of inputs) {
    validateInput(input)
  }
}

function validateInput(input: Input): void {
  if (!Array.isArray(input) || input.length !== 2) {
    throw new TypeError('invalid input (not a 2-items array)')
  } else if (input[0] < 0 || input[0] >= Move.COUNT) {
    throw new TypeError('invalid input (invalid move)')
  }
}
