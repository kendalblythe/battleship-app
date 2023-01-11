import { Coordinate, Grid } from 'battleship-engine/types';
import { Translate } from '../locales';

/**
 * Returns a grid config label.
 * @param gridConfigId Grid config id
 * @param t Translate function
 * @returns Grid config label
 */
export const getGridConfigLabel = (gridConfigId: string, t: Translate): string =>
  t(`gridConfig.${gridConfigId}.label`);

/**
 * Returns a ship label.
 * @param shipId Ship id
 * @param t Translate function
 * @returns Ship label
 */
export const getShipLabel = (shipId: string, t: Translate): string => t(`ship.${shipId}.label`);

/**
 * Returns a row label.
 * @param rowIndex Row index
 * @returns Row label
 */
export const getRowLabel = (rowIndex: number): string => rowIndex.toString();

/**
 * Returns a column label.
 * @param columnIndex Column index
 * @param t Translate function
 * @returns Column label
 */
export const getColumnLabel = (columnIndex: number, t: Translate): string =>
  String.fromCharCode(t('oceanGrid.firstColumnLetter.label').charCodeAt(0) + columnIndex - 1);

/**
 * Returns a coordinate label.
 * @param coordinate Coordinate
 * @param t Translate function
 * @returns Coordinate label
 */
export const getCoordinateLabel = (coordinate: Coordinate, t: Translate): string | null =>
  getCoordinateLabelXY(coordinate.y, coordinate.x, t);

/**
 * Returns a coordinate label.
 * @param rowIndex Row index
 * @param columnIndex Column index
 * @param t Translate function
 * @returns Coordinate label
 */
export const getCoordinateLabelXY = (
  rowIndex: number,
  columnIndex: number,
  t: Translate
): string | null =>
  rowIndex && columnIndex ? getColumnLabel(columnIndex, t) + getRowLabel(rowIndex) : null;

/**
 * Returns sunk ship ids.
 * @param grid Grid
 * @returns Sunk ship ids
 */
export const getSunkShipIds = (grid: Grid): string[] =>
  grid.bombedCoordinates
    .filter((coordinate) => !!coordinate.sunkShip)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((coordinate) => coordinate.sunkShip!.id);
