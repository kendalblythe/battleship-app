import { BombedCoordinate, Coordinate, Grid, GridConfig, GridSize, Ship } from '../types';
import { getGridConfig } from './config';
import { CoordinatePair, CoordinateSet, coordinateToString } from './coordinate';
import { EngineErrorType, createEngineError } from './error';
import { randomBoolean, randomInt, shuffle } from './random';

/**
 * Creates a grid with randomly placed ships for the grid config.
 * @param gridConfigId Grid config id
 * @returns Grid
 */
export const createGrid = (gridConfigId: string): Grid => {
  const gridConfig = getGridConfig(gridConfigId);
  const grid: Grid = {
    gridConfigId,
    size: gridConfig.size,
    ships: gridConfig.ships.map((ship) => ({
      ...ship,
      coordinates: [],
    })),
    playerNum: 0,
    bombedCoordinates: [],
  };
  randomlyPlaceShips(grid);
  return grid;
};

/**
 * Randomly places ships on the grid.
 * @param grid Grid
 */
export const randomlyPlaceShips = (grid: Grid): void => {
  const occupiedCoordinateSet = new CoordinateSet();
  let shipsPlaced = 0;
  let horizontalOrientationCount = 0;

  // place largest ships 1st followed by randomly ordered other ships followed by 1 length ships
  const largestShip = grid.ships[0];
  const largestShips = grid.ships.filter((ship) => ship.length === largestShip.length);
  const oneLengthShips = grid.ships.filter((ship) => ship.length === 1);
  const otherShips = shuffle(
    grid.ships.filter((ship) => ship.length !== largestShip.length && ship.length !== 1)
  );
  const orderedShips = [...largestShips, ...otherShips, ...oneLengthShips];

  // place each ship
  const allowAdjacentShip = randomInt(5) === 0; // 1/5 of grids allow 1 adjacent ship
  let hasAdjacentShip = false;
  for (const ship of orderedShips) {
    // loop until ship start/end coordinates set
    while (ship.coordinates.length === 0) {
      // get random orientation
      // (if 1st 2 ships have same orientation, then hard code opposite orientation)
      let horizontalOrientation: boolean;
      if (shipsPlaced === 2) {
        switch (horizontalOrientationCount) {
          case 0:
            horizontalOrientation = true;
            break;
          case 2:
            horizontalOrientation = false;
            break;
          default:
            horizontalOrientation = randomBoolean();
            break;
        }
      } else {
        horizontalOrientation = randomBoolean();
      }

      // get random start coordinate
      const startX = randomInt(grid.size.x) + 1;
      const startY = randomInt(grid.size.y) + 1;
      const startCoordinate: Coordinate = { x: startX, y: startY };

      // stop here if start coordinate already occupied
      if (occupiedCoordinateSet.has(startCoordinate)) {
        continue;
      }

      const coordinates: Coordinate[] = [];
      coordinates.push(startCoordinate);

      // determine remaining coordinates
      let invalidCoordinate = false;
      if (horizontalOrientation) {
        for (let i = 1; i < ship.length; i++) {
          const x = startX + i;
          const y = startY;

          // stop here if coordinate invalid
          if (x > grid.size.x) {
            invalidCoordinate = true;
            break;
          }

          // stop here if coordinate occupied
          const coordinate: Coordinate = { x, y };
          if (occupiedCoordinateSet.has(coordinate)) {
            invalidCoordinate = true;
            break;
          }

          // add coordinate
          coordinates.push(coordinate);
        }
      } else {
        for (let i = 1; i < ship.length; i++) {
          const x = startX;
          const y = startY + i;

          // stop here if coordinate invalid
          if (y > grid.size.y) {
            invalidCoordinate = true;
            break;
          }

          // stop here if coordinate occupied
          const coordinate: Coordinate = { x, y };
          if (occupiedCoordinateSet.has(coordinate)) {
            invalidCoordinate = true;
            break;
          }

          // add coordinate
          coordinates.push(coordinate);
        }
      }

      // stop here if coordinate invalid
      if (invalidCoordinate) {
        continue;
      }

      // allow 1 adjacent ship if adjacent ships allowed; otherwise stop here
      if (isAdjacentToOccupiedCoordinate(coordinates, occupiedCoordinateSet)) {
        if (!allowAdjacentShip || hasAdjacentShip) {
          continue;
        }
        hasAdjacentShip = true;
      }

      // set ship coordinates
      ship.coordinates = coordinates;

      // update occupied coordinates set
      for (const coordinate of coordinates) {
        occupiedCoordinateSet.add(coordinate);
      }

      // update counts
      shipsPlaced++;
      if (horizontalOrientation) {
        horizontalOrientationCount++;
      }
    }
  }
};

/**
 * @param grid Drops a bomb on the grid at the specified coordinate.
 * @param grid Grid
 * @param coordinate Coordinate
 * @returns Bombed coordinate
 * @throws {EngineError} [
 *   EngineErrorType.gameOverBombDrop,
 *   EngineErrorType.invalidBombCoordinate,
 * ]
 */
export const dropBomb = (grid: Grid, coordinate: Coordinate): BombedCoordinate => {
  const bombedCoordinateSet = new CoordinateSet(grid.bombedCoordinates);

  // validate coordinate
  if (bombedCoordinateSet.has(coordinate)) {
    throw createEngineError(EngineErrorType.invalidBombCoordinate, [
      coordinateToString(coordinate),
    ]);
  }

  // validate game not over
  if (isAllShipsSunk(grid)) {
    throw createEngineError(EngineErrorType.gameOverBombDrop);
  }

  // drop bomb
  const bombedCoordinate: BombedCoordinate = { ...coordinate, isHit: false };
  grid.bombedCoordinates.push(bombedCoordinate);

  // determine if hit/sunk ship
  for (const ship of grid.ships) {
    for (const shipCoordinate of ship.coordinates) {
      if (isCoordinatesEqual(coordinate, shipCoordinate)) {
        bombedCoordinate.isHit = true;
        if (isSunkShip(ship, grid)) {
          bombedCoordinate.sunkShip = ship;
        }
        break;
      }
    }
    if (bombedCoordinate.isHit) {
      break;
    }
  }

  return bombedCoordinate;
};

/**
 * Returns true if coordinate is adjacent to occupied coordinate.
 * Otherwise false is returned.
 * @param coordinates Coordinates
 * @param occupiedCoordinateSet Occupied coordinate set
 * @returns True if coordinate is adjacent to occupied coordinate
 */
export const isAdjacentToOccupiedCoordinate = (
  coordinates: Coordinate[],
  occupiedCoordinateSet: CoordinateSet
): boolean => {
  let hasAdjacentShip = false;
  for (const coordinate of coordinates) {
    const { x, y } = coordinate;
    const top: Coordinate = { x, y: y - 1 };
    const bottom: Coordinate = { x, y: y + 1 };
    const left: Coordinate = { x: x - 1, y };
    const right: Coordinate = { x: x + 1, y };
    hasAdjacentShip = [top, bottom, left, right].some((adjacentCoordinate) => {
      return occupiedCoordinateSet.has(adjacentCoordinate);
    });
    if (hasAdjacentShip) {
      break;
    }
  }
  return hasAdjacentShip;
};

/**
 * Throws an engine error if the grid does not match the grid config.
 */
/**
 * Validates that the grid matches the grid config.
 * @param grid Grid
 * @param gridConfig Grid config
 * @throws {EngineError} [
 *   EngineErrorType.gridConfigMismatch,
 * ]
 */
export const validateGridMatchGridConfig = (grid: Grid, gridConfig: GridConfig): void => {
  if (!isGridSizesEqual(grid.size, gridConfig.size)) {
    throw createEngineError(EngineErrorType.gridConfigMismatch, [grid.gridConfigId]);
  }
  if (grid.ships.length !== gridConfig.ships.length) {
    throw createEngineError(EngineErrorType.gridConfigMismatch, [grid.gridConfigId]);
  }
  for (let i = 0; i < grid.ships.length; i++) {
    const gridShip = grid.ships[i];
    const gridConfigShip = gridConfig.ships[i];
    if (gridShip.length !== gridConfigShip.length) {
      throw createEngineError(EngineErrorType.gridConfigMismatch, [grid.gridConfigId]);
    }
    if (gridShip.coordinates.length !== gridConfigShip.length) {
      throw createEngineError(EngineErrorType.gridConfigMismatch, [grid.gridConfigId]);
    }
  }
};

/**
 * Validates that the grid ship coordinates are valid.
 * @param grid Grid
 * @throws {EngineError} [
 *   EngineErrorType.invalidShipCoordinate,
 *   EngineErrorType.overlappingShipCoordinate,
 *   EngineErrorType.nonadjacentShipCoordinates,
 * ]
 */
export const validateGridShipCoordinates = (grid: Grid): void => {
  const { availableCoordinates } = getAvailableCoordinates(grid);
  const availableCoordinateSet = new CoordinateSet(availableCoordinates);
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
 * @param grid Grid
 * @returns Grid coordinates
 */
export const getAvailableCoordinates = (
  grid: Grid
): { availableCoordinates: Coordinate[]; bombedCoordinateSet: CoordinateSet } => {
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
  return { availableCoordinates, bombedCoordinateSet };
};

/**
 * Returns true if all ships sunk. Otherwise false is returned.
 * @param grid Grid
 * @returns True if all ships sunk
 */
export const isAllShipsSunk = (grid: Grid): boolean => {
  let sunkShipCount = 0;
  for (const ship of grid.ships) {
    if (isSunkShip(ship, grid)) {
      sunkShipCount++;
    }
  }
  return sunkShipCount === grid.ships.length;
};

/**
 * Returns true if the ship is sunk. Otherwise false is returned.
 * @param ship Ship
 * @param grid Grid
 * @returns True if the ship is sunk
 */
export const isSunkShip = (ship: Ship, grid: Grid): boolean => {
  const bombedCoordinateSet = new CoordinateSet(grid.bombedCoordinates);
  let hitCount = 0;
  for (const coordinate of ship.coordinates) {
    if (bombedCoordinateSet.has(coordinate)) {
      if (++hitCount === ship.length) {
        return true;
      }
    }
  }
  return false;
};

/**
 *
 * @param grid Returns true if adjacent coordinate is bombed. Otherwise false is returned.
 * @param bombedCoordinateSet Bombed coordinate set
 * @param coordinate Coordinate
 * @returns True if adjacent coordinate is bombed.
 */
export const isAdjacentCoordinateBombed = (
  bombedCoordinateSet: CoordinateSet,
  coordinate: Coordinate
): boolean => {
  const { x, y } = coordinate;
  const top: Coordinate = { x, y: y - 1 };
  const bottom: Coordinate = { x, y: y + 1 };
  const left: Coordinate = { x: x - 1, y };
  const right: Coordinate = { x: x + 1, y };
  return [top, bottom, left, right].some((adjacentCoordinate) => {
    return bombedCoordinateSet.has(adjacentCoordinate);
  });
};

/**
 * Returns true if the coordinates are adjacent. Otherwise false is returned.
 * @param coordinate1 Coordinate 1
 * @param coordinate2 Coordinate 2
 * @returns True if the coordinates are adjacent
 */
export const isAdjacentCoordinates = (
  coordinate1: Coordinate,
  coordinate2: Coordinate
): boolean => {
  const diffX = Math.abs(coordinate1.x - coordinate2.x);
  const diffY = Math.abs(coordinate1.y - coordinate2.y);
  return (diffX === 0 && diffY === 1) || (diffX === 1 && diffY === 0);
};

/**
 * Returns true if the coordinates are equal. Otherwise false is returned.
 * @param coordinate1 Coordinate 1
 * @param coordinate2 Coordinate 2
 * @returns True if the coordinates are equal
 */
export const isCoordinatesEqual = (coordinate1: Coordinate, coordinate2: Coordinate): boolean =>
  coordinate1.x === coordinate2.x && coordinate1.y === coordinate2.y;

/**
 * Returns true if the sizes are equal. Otherwise false is returned.
 * @param size1 Size 1
 * @param size2 Size 2
 * @returns True if the sizes are equal
 */
export const isGridSizesEqual = (size1: GridSize, size2: GridSize): boolean =>
  size1.x === size2.x && size1.y === size2.y;
