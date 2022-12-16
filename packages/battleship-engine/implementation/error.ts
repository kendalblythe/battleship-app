/**
 * Engine error.
 */
export class EngineError extends Error {
  public type: EngineErrorType;
  constructor(type: EngineErrorType, message: string) {
    super(message);
    this.name = "EngineError";
    this.type = type;
  }
}

/**
 * Engine error type.
 */
export enum EngineErrorType {
  coordinateAlreadyBombed,
  gameOverBombDrop,
  gridConfigMismatch,
  gridConfigNotFound,
  invalidBombCoordinate,
  invalidShipCoordinate,
  nonadjacentShipCoordinates,
  overlappingShipCoordinate,
}

/**
 * Creates an EngineError instance.
 * @param type Engine error type
 * @param messageArgs Engine error type message arguments
 * @returns EngineError instance
 */
export const createEngineError = (
  type: EngineErrorType,
  messageArgs?: string[]
): EngineError => new EngineError(type, getErrorMessage(type, messageArgs));

/**
 * Returns engine error type message.
 * @param type Engine error type
 * @returns Engine error type message
 */
const getErrorTypeMessage = (type: EngineErrorType): string => {
  switch (type) {
    case EngineErrorType.coordinateAlreadyBombed:
      return "Coordinate '{0}' already bombed.";
    case EngineErrorType.gameOverBombDrop:
      return "Not player turn to drop bomb - game over.";
    case EngineErrorType.gridConfigMismatch:
      return "Grid does not match grid configuration '{0}'.";
    case EngineErrorType.gridConfigNotFound:
      return "Grid configuration not found for id '{0}'.";
    case EngineErrorType.invalidBombCoordinate:
      return "Invalid bomb coordinate '{0}'.";
    case EngineErrorType.invalidShipCoordinate:
      return "Invalid ship coordinate '{0}'.";
    case EngineErrorType.nonadjacentShipCoordinates:
      return "Nonadjacent ship coordinates '{0}' and '{1}'.";
    case EngineErrorType.overlappingShipCoordinate:
      return "Overlapping ship coordinate '{0}'.";
  }
};

/**
 * Returns engine error message.
 * @param type Engine error type
 * @param messageArgs Engine error type message arguments
 * @returns Engine error message
 */
const getErrorMessage = (
  type: EngineErrorType,
  messageArgs?: string[]
): string => {
  let message = getErrorTypeMessage(type);
  if (messageArgs) {
    for (let i = 0; i < messageArgs.length; i++) {
      message = message.replace(`{${i}}`, messageArgs[i]);
    }
  }
  return message;
};
