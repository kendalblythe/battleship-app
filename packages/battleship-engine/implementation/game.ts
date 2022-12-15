import { createGrid, getGridConfig } from "./config";
import {
  validateGridMatchGridConfig,
  validateGridShipCoordinates,
} from "./utils/game-utils";
import { Game, Grid } from "../types";
import { randomBoolean } from "./utils/random-utils";

export const startGame = (playerGrid: Grid): Game => {
  const gridConfig = getGridConfig(playerGrid.gridConfigId);

  // validate grid matches grid configuration
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

  // drop system player bomb if opponent 1st player
  if (opponentPlayerNum == 1) {
    // dropSystemPlayerBomb(playerGrid);
  }

  return { playerGrid, opponentGrid } as Game;
};
