import { Coordinate } from "../types";

export function getCoordinateKey(coordinate: Coordinate): string;
export function getCoordinateKey(x: number, y: number): string;
export function getCoordinateKey(
  arg1: Coordinate | number,
  arg2?: number
): string {
  return typeof arg1 === "number" ? `${arg1}_${arg2}` : `${arg1.x}_${arg1.y}`;
}
