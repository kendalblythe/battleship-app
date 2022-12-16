import { Coordinate, Grid } from "battleship-engine/types";
import { Translate } from "../locales";

export const getGridConfigLabel = (
  gridConfigId: string,
  t: Translate
): string => t(`gridConfig.${gridConfigId}.label`);

export const getShipLabel = (shipId: string, t: Translate): string =>
  t(`ship.${shipId}.label`);

export const getRowLabel = (rowIndex: number): string => rowIndex.toString();

export const getColumnLabel = (columnIndex: number, t: Translate): string =>
  String.fromCharCode(
    t("oceanGrid.firstColumnLetter.label").charCodeAt(0) + columnIndex - 1
  );

export const getCoordinateLabel = (
  coordinate: Coordinate,
  t: Translate
): string | null => getCoordinateLabelXY(coordinate.y, coordinate.x, t);

export const getCoordinateLabelXY = (
  rowIndex: number,
  columnIndex: number,
  t: Translate
): string | null =>
  rowIndex && columnIndex
    ? getColumnLabel(columnIndex, t) + getRowLabel(rowIndex)
    : null;

export const getSunkShipIds = (grid: Grid): string[] =>
  grid.bombedCoordinates
    .filter((coordinate) => !!coordinate.sunkShip)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((coordinate) => coordinate.sunkShip!.id);
