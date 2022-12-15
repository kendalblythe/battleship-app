import { Coordinate, Grid } from "../../types";
import { CoordinateSet } from "./coordinate-utils";
import { randomBoolean, randomInt, shuffle } from "./random-utils";

/**
 * Randomly places ships on the grid.
 */
export const randomlyPlaceShips = (grid: Grid): void => {
  const occupiedCoordinateSet = new CoordinateSet();
  let shipsPlaced = 0;
  let horizontalOrientationCount = 0;

  // place largest ships 1st followed by randomly ordered other ships followed by 1 length ships
  const largestShip = grid.ships[0];
  const largestShips = grid.ships.filter(
    (ship) => ship.length === largestShip.length
  );
  const oneLengthShips = grid.ships.filter((ship) => ship.length === 1);
  const otherShips = shuffle(
    grid.ships.filter(
      (ship) => ship.length !== largestShip.length && ship.length !== 1
    )
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
      if (shipsPlaced == 2) {
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
 * Returns true if the coordinate is adjacent to an occupied coordinate.
 * Otherwise false is returned.
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
