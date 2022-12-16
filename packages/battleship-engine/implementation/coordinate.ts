import { Coordinate } from "../types";

/**
 * Returns a coordinate as a string.
 * @return Coordinate as string
 */
export function coordinateToString(coordinate: Coordinate): string;
export function coordinateToString(x: number, y: number): string;
export function coordinateToString(
  arg1: Coordinate | number,
  arg2?: number
): string {
  return typeof arg1 === "number" ? `${arg1},${arg2}` : `${arg1.x},${arg1.y}`;
}

/**
 * Coordinate set.
 */
export class CoordinateSet {
  private map: Map<string, Coordinate>;

  constructor(coordinates?: Coordinate[]) {
    this.map = new Map();
    if (coordinates) {
      for (const coordinate of coordinates) {
        this.add(coordinate);
      }
    }
  }

  add(coordinate: Coordinate) {
    this.map.set(coordinateToString(coordinate), coordinate);
  }

  clear() {
    this.map.clear();
  }

  delete(coordinate: Coordinate) {
    return this.map.delete(coordinateToString(coordinate));
  }

  entries() {
    return this.map.entries();
  }

  forEach(
    callbackfn: (
      value: Coordinate,
      key: string,
      map: Map<string, Coordinate>
    ) => void,
    thisArg?: unknown
  ) {
    this.map.forEach(callbackfn, thisArg);
  }

  has(coordinate: Coordinate) {
    return this.map.has(coordinateToString(coordinate));
  }

  keys() {
    return Array.from(this.map.keys());
  }

  get size() {
    return this.map.size;
  }

  values() {
    return Array.from(this.map.values());
  }
}

/**
 * Coordinate pair.
 */
export interface CoordinatePair {
  coordinate1: Coordinate;
  coordinate2: Coordinate;
}
