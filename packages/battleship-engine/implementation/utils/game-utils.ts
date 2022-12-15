import { Coordinate, Grid, GridConfig, GridSize, Ship } from "../../types";
import { CoordinateSet, coordinateToString } from "./coordinate-utils";
import { createEngineError, EngineErrorType } from "./error-utils";
import { randomInt } from "./random-utils";

/**
 * Throws an engine error if the grid does not match the grid config.
 */
export const validateGridMatchGridConfig = (
  grid: Grid,
  gridConfig: GridConfig
): void => {
  if (!isGridSizesEqual(grid.size, gridConfig.size)) {
    throw createEngineError(EngineErrorType.gridConfigMismatch, [
      grid.gridConfigId,
    ]);
  }
  if (grid.ships.length !== gridConfig.ships.length) {
    throw createEngineError(EngineErrorType.gridConfigMismatch, [
      grid.gridConfigId,
    ]);
  }
  for (let i = 0; i < grid.ships.length; i++) {
    const gridShip = grid.ships[i];
    const gridConfigShip = gridConfig.ships[i];
    if (gridShip.length !== gridConfigShip.length) {
      throw createEngineError(EngineErrorType.gridConfigMismatch, [
        grid.gridConfigId,
      ]);
    }
    if (gridShip.coordinates.length !== gridConfigShip.length) {
      throw createEngineError(EngineErrorType.gridConfigMismatch, [
        grid.gridConfigId,
      ]);
    }
  }
};

/**
 * Throws an engine error if grid ship coordinates are not valid.
 */
export const validateGridShipCoordinates = (grid: Grid): void => {
  const availableCoordinateSet = new CoordinateSet(
    getAvailableCoordinates(grid)
  );
  const placedCoordinateSet = new CoordinateSet();
  for (const ship of grid.ships) {
    let previousCoordinate: Coordinate | undefined;
    for (const coordinate of ship.coordinates) {
      if (!availableCoordinateSet.has(coordinate)) {
        throw createEngineError(EngineErrorType.invalidShipCoordinate, [
          coordinateToString(coordinate),
        ]);
      }
      if (placedCoordinateSet.has(coordinate)) {
        throw createEngineError(EngineErrorType.overlappingShipCoordinate, [
          coordinateToString(coordinate),
        ]);
      }
      if (
        previousCoordinate !== undefined &&
        !isAdjacentCoordinates(coordinate, previousCoordinate)
      ) {
        throw createEngineError(EngineErrorType.nonadjacentShipCoordinates, [
          coordinateToString(previousCoordinate),
          coordinateToString(coordinate),
        ]);
      }
      placedCoordinateSet.add(coordinate);
      previousCoordinate = coordinate;
    }
  }
};

/**
 * Returns available grid coordinates.
 */
export const getAvailableCoordinates = (grid: Grid): Coordinate[] => {
  const bombedCoordinateSet = new CoordinateSet(grid.bombedCoordinates);
  const availableCoordinates: Coordinate[] = [];
  for (let x = 1; x <= grid.size.x; x++) {
    for (let y = 1; y <= grid.size.y; y++) {
      const coordinate: Coordinate = { x, y };
      if (!bombedCoordinateSet.has(coordinate)) {
        availableCoordinates.push(coordinate);
      }
    }
  }
  return availableCoordinates;
};

/**
 * Returns a random available grid coordinate.
 */
export const getRandomAvailableCoordinate = (grid: Grid): Coordinate => {
  const availableCoordinates = getAvailableCoordinates(grid);
  if (availableCoordinates.length === 0) {
    throw createEngineError(EngineErrorType.gameOverBombDrop);
  }
  return availableCoordinates[randomInt(availableCoordinates.length)];
};

/**
 * Returns true if all ships sunk. Otherwise false is returned.
 */
export const isAllShipsSunk = (grid: Grid): boolean => {
  let sunkShipCount = 0;
  for (const ship of grid.ships) {
    if (isSunkShip(ship, grid)) {
      sunkShipCount++;
    }
  }
  return sunkShipCount == grid.ships.length;
};

/**
 * Returns true if the ship is sunk. Otherwise false is returned.
 */
export const isSunkShip = (ship: Ship, grid: Grid): boolean => {
  const bombedCoordinateSet = new CoordinateSet(grid.bombedCoordinates);
  let hitCount = 0;
  for (const coordinate of ship.coordinates) {
    if (bombedCoordinateSet.has(coordinate)) {
      if (++hitCount == ship.length) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Returns true if the coordinates are adjacent. Otherwise false is returned.
 */
export const isAdjacentCoordinates = (
  coordinate1: Coordinate,
  coordinate2: Coordinate
): boolean => {
  const diffX = Math.abs(coordinate1.x - coordinate2.x);
  const diffY = Math.abs(coordinate1.y - coordinate2.y);
  return (diffX == 0 && diffY == 1) || (diffX == 1 && diffY == 0);
};

/**
 * Returns true if the sizes are equal. Otherwise false is returned.
 */
export const isGridSizesEqual = (size1: GridSize, size2: GridSize): boolean =>
  size1.x === size2.x && size1.y === size2.y;
