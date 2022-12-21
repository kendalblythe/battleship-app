import { BombedCoordinate, Coordinate, Grid } from '../types';
import { CoordinatePair, CoordinateSet } from './coordinate';
import { createEngineError, EngineErrorType } from './error';
import {
  dropBomb,
  getAvailableCoordinates,
  isAdjacentCoordinateBombed,
  isAdjacentCoordinates,
} from './grid';
import { randomBoolean, randomInt } from './random';

/**
 * Drops a bomb on the grid using artificial intelligence to determine the coordinate to attack.
 * @param grid Grid
 * @returns Bombed coordinate
 * @throws {EngineError} [
 *   EngineErrorType.gameOverBombDrop,
 * ]
 */
export const dropArtificialIntelligentBomb = (grid: Grid): BombedCoordinate => {
  const { availableCoordinates, bombedCoordinateSet } = getAvailableCoordinates(grid);

  // get ship hit coordinates not associated with a sunk ship
  const hitCoordinateSet = new CoordinateSet();
  for (const bombedCoordinate of grid.bombedCoordinates) {
    if (bombedCoordinate.isHit) {
      hitCoordinateSet.add(bombedCoordinate);
      if (bombedCoordinate.sunkShip) {
        for (const shipCoordinate of bombedCoordinate.sunkShip.coordinates) {
          hitCoordinateSet.delete(shipCoordinate);
        }
      }
    }
  }

  // drop targeted bomb to sink already hit ship if applicable
  if (hitCoordinateSet.size) {
    const availableCoordinateSet = new CoordinateSet(availableCoordinates);

    // get ordered hit coordinates
    const orderedHitCoordinates = hitCoordinateSet.values();
    orderedHitCoordinates.sort((a, b) => {
      if (a.x === b.x) return a.y - b.y;
      return a.x - b.x;
    });

    // get adjacent hit coordinates
    const adjacentHitCoordinates: CoordinatePair[] = [];
    for (let i = 0; i < orderedHitCoordinates.length - 1; i++) {
      const coordinate1 = orderedHitCoordinates[i];
      for (let j = i + 1; j < orderedHitCoordinates.length; j++) {
        const coordinate2 = orderedHitCoordinates[j];
        if (isAdjacentCoordinates(coordinate1, coordinate2)) {
          adjacentHitCoordinates.push({ coordinate1, coordinate2 });
        }
      }
    }

    // bomb adjacent hit path coordinate if available
    for (const { coordinate1, coordinate2 } of adjacentHitCoordinates) {
      const deltas = randomBoolean() ? [1, -1] : [-1, 1];
      if (coordinate1.x === coordinate2.x) {
        // direction vertical
        for (const delta of deltas) {
          let nextCoordinate: Coordinate = {
            x: coordinate1.x,
            y: coordinate2.y + delta,
          };
          while (hitCoordinateSet.has(nextCoordinate)) {
            nextCoordinate = { x: coordinate1.x, y: nextCoordinate.y + delta };
          }
          if (availableCoordinateSet.has(nextCoordinate)) {
            return dropBomb(grid, nextCoordinate);
          }
        }
      } else {
        // direction horizontal
        for (const delta of deltas) {
          let nextCoordinate: Coordinate = {
            x: coordinate2.x + delta,
            y: coordinate1.y,
          };
          while (hitCoordinateSet.has(nextCoordinate)) {
            nextCoordinate = { x: nextCoordinate.x + delta, y: coordinate1.y };
          }
          if (availableCoordinateSet.has(nextCoordinate)) {
            return dropBomb(grid, nextCoordinate);
          }
        }
      }
    }

    // bomb random adjacent hit coordinate if available
    for (const coordinate of orderedHitCoordinates) {
      const adjacentCoordinates: Coordinate[] = [
        { x: coordinate.x + 1, y: coordinate.y },
        { x: coordinate.x - 1, y: coordinate.y },
        { x: coordinate.x, y: coordinate.y + 1 },
        { x: coordinate.x, y: coordinate.y - 1 },
      ];
      const availableAdjacentCoordinates = adjacentCoordinates.filter((coordinate) =>
        availableCoordinateSet.has(coordinate)
      );
      if (availableAdjacentCoordinates.length) {
        const coordinate =
          availableAdjacentCoordinates[randomInt(availableAdjacentCoordinates.length)];
        return dropBomb(grid, coordinate);
      }
    }
  }

  // drop bomb on random non-adjacent available coordinate if available, else on random available coordinate
  const nonAdjacentAvailableCoordinates = availableCoordinates.filter(
    (coordinate) => !isAdjacentCoordinateBombed(bombedCoordinateSet, coordinate)
  );
  const coordinates = nonAdjacentAvailableCoordinates.length
    ? nonAdjacentAvailableCoordinates
    : availableCoordinates;
  const coordinate = coordinates[randomInt(coordinates.length)];
  return dropBomb(grid, coordinate);
};
