import cloneDeep from 'lodash/cloneDeep';

import { Coordinate, Game, Grid } from '../types';
import { dropArtificialIntelligentBomb } from './ai';
import { getGridConfig } from './config';
import { createEngineError, EngineErrorType } from './error';
import {
  createGrid,
  dropBomb,
  isAllShipsSunk,
  validateGridMatchGridConfig,
  validateGridShipCoordinates,
} from './grid';
import { randomBoolean } from './random';

/**
 * Starts a new game.
 * @param playerGrid Player grid
 * @returns Game
 * @throws {EngineError} [
 *   EngineErrorType.gridConfigMismatch,
 *   EngineErrorType.invalidShipCoordinate,
 *   EngineErrorType.overlappingShipCoordinate,
 *   EngineErrorType.nonadjacentShipCoordinates,
 * ]
 */
export const startGame = (playerGrid: Grid): Game => {
  const gridConfig = getGridConfig(playerGrid.gridConfigId);

  // validate grid matches grid config
  validateGridMatchGridConfig(playerGrid, gridConfig);

  // validate your grid ship coordinates
  validateGridShipCoordinates(playerGrid);

  // create opponent grid
  const opponentGrid = createGrid(playerGrid.gridConfigId);

  // determine 1st/2nd player
  const playerNum = randomBoolean() ? 1 : 2;
  const opponentPlayerNum = playerNum === 1 ? 2 : 1;
  playerGrid.playerNum = playerNum;
  opponentGrid.playerNum = opponentPlayerNum;

  // drop opponent bomb on player grid if opponent 1st player
  if (opponentPlayerNum === 1) {
    dropArtificialIntelligentBomb(playerGrid);
  }

  return { playerGrid, opponentGrid } as Game;
};

/**
 * Drops a player bomb on the opponent grid at the specified coordinate.
 * @param game Game
 * @param coordinate Coordinate
 * @returns The updated game
 * @throws {EngineError} [
 *   EngineErrorType.gameOverBombDrop,
 *   EngineErrorType.invalidBombCoordinate,
 * ]
 */
export const dropPlayerBomb = (game: Game, coordinate: Coordinate): Game => {
  const updatedGame = cloneDeep(game);
  const { playerGrid, opponentGrid } = updatedGame;

  // validate game not over
  if (updatedGame.winningPlayerNum) {
    throw createEngineError(EngineErrorType.gameOverBombDrop);
  }

  // drop bomb
  dropBomb(opponentGrid, coordinate);

  // determine if game over
  if (isAllShipsSunk(opponentGrid)) {
    // game over - player winner
    updatedGame.winningPlayerNum = playerGrid.playerNum;
  } else {
    // game not over - drop opponent bomb
    dropArtificialIntelligentBomb(playerGrid);

    // determine if game over
    if (isAllShipsSunk(playerGrid)) {
      // game over - opponent winner
      updatedGame.winningPlayerNum = opponentGrid.playerNum;
    }
  }

  return updatedGame;
};
