import { Translate } from "../locales";

export const getGridConfigLabel = (gridConfigId: string, t: Translate) =>
  t(`gridConfig.${gridConfigId}.label`);

export const getShipLabel = (shipId: string, t: Translate) =>
  t(`ship.${shipId}.label`);

export const getRowLabel = (rowIndex: number): string => rowIndex.toString();

export const getColumnLabel = (columnIndex: number, t: Translate): string =>
  String.fromCharCode(
    t("oceanGrid.firstColumnLetter.label").charCodeAt(0) + columnIndex - 1
  );

export const getCoordinateLabel = (
  rowIndex: number,
  columnIndex: number,
  t: Translate
): string | null =>
  rowIndex && columnIndex
    ? getColumnLabel(columnIndex, t) + getRowLabel(rowIndex)
    : null;
