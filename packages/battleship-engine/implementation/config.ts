import config from "./config.json";
import { randomlyPlaceShips } from "./utils/config-utils";
import { createEngineError, EngineErrorType } from "./utils/error-utils";
import { Grid, GridConfig } from "../types";

export const getGridConfigs = (): GridConfig[] => config.gridConfigs;

export const getGridConfig = (gridConfigId: string): GridConfig => {
  const gridConfig = getGridConfigs().find(
    (gridConfig) => gridConfig.id === gridConfigId
  );
  if (!gridConfig)
    throw createEngineError(EngineErrorType.gridConfigNotFound, [gridConfigId]);
  return gridConfig;
};

export const createGrid = (
  gridConfigId: string,
  isOpponentGrid = false
): Grid => {
  const gridConfig = getGridConfig(gridConfigId);
  const grid: Grid = {
    gridConfigId,
    size: gridConfig.size,
    ships: gridConfig.ships.map((ship) => ({
      ...ship,
      coordinates: [],
    })),
    playerNum: 0,
    isOpponentGrid,
    bombedCoordinates: [],
  };
  randomlyPlaceShips(grid);
  return grid;
};
