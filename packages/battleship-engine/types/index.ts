export interface GridSize {
  x: number;
  y: number;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Ship {
  id: string;
  length: number;
  coordinates: Coordinate[];
}

export interface BombedCoordinate {
  x: number;
  y: number;
  hit: boolean;
  sunkenShip?: Ship;
}

export interface GridConfig {
  id: string;
  size: GridSize;
  ships: Omit<Ship, "coordinates">[];
}

export interface Grid {
  gridConfigId: string;
  size: GridSize;
  ships: Ship[];
  bombedCoordinates: BombedCoordinate[];
}

export interface Game {
  id: string;
  yourGrid: Grid;
  opponentGrid: Grid;
  winningPlayerNum?: number;
}
