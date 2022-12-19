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

export interface BombedCoordinate extends Coordinate {
  isHit: boolean;
  sunkShip?: Ship;
}

export interface GridConfig {
  id: string;
  size: GridSize;
  ships: Omit<Ship, 'coordinates'>[];
}

export interface Grid {
  gridConfigId: string;
  size: GridSize;
  ships: Ship[];
  playerNum: number;
  bombedCoordinates: BombedCoordinate[];
}

export interface Game {
  playerGrid: Grid;
  opponentGrid: Grid;
  winningPlayerNum?: number;
}
