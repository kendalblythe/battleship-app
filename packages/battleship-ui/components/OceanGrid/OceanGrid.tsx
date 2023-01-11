import { ReactElement, RefObject } from 'react';
import { clsx } from 'clsx';
import { BombedCoordinate, Grid } from 'battleship-engine/types';
import { PlacedShip } from './PlacedShip';
import { TableCell } from './TableCell';
import { useTranslate } from '../../locales';
import {
  getColumnLabel,
  getCoordinateLabel,
  getCoordinateLabelXY,
  getRowLabel,
  getShipLabel,
  getSunkShipIds,
} from '../../utils';
import styles from './OceanGrid.module.scss';

export interface OceanGridProps {
  className?: string;
  tableRef?: RefObject<HTMLTableElement>;
  grid: Grid;
  isOpponentGrid?: boolean;
  displaySize?: OceanGridDisplaySize;
  onDropBomb?: (x: number, y: number) => void;
}

export const OceanGrid = ({
  className,
  tableRef,
  grid,
  isOpponentGrid = false,
  displaySize = OceanGridDisplaySize.Medium,
  onDropBomb,
}: OceanGridProps) => {
  const t = useTranslate();
  const sunkShipIdSet = new Set(getSunkShipIds(grid));

  // determine cell size based on display size
  let cellSize: number;
  switch (displaySize) {
    case OceanGridDisplaySize.Small:
      cellSize = 32; // 2rem
      break;
    case OceanGridDisplaySize.Medium:
      cellSize = 40; // 2.5rem
      break;
    case OceanGridDisplaySize.Large:
      cellSize = 48; // 3rem
      break;
  }

  // initialize ship coordinate/label map
  const shipCoordinateLabelMap = new Map<string | null, string>();
  grid.ships.forEach((ship) => {
    ship.coordinates.forEach((coordinate) =>
      shipCoordinateLabelMap.set(getCoordinateLabel(coordinate, t), getShipLabel(ship.id, t))
    );
  });

  // initialize bombed coordinate map
  const bombedCoordinateMap = new Map<string | null, BombedCoordinate>();
  grid.bombedCoordinates.forEach((coordinate) =>
    bombedCoordinateMap.set(getCoordinateLabel(coordinate, t), coordinate)
  );

  const createColumns = (rowIndex: number): Array<ReactElement> => {
    const columns = new Array<ReactElement>();
    for (let columnIndex = 0; columnIndex <= grid.size.x; columnIndex += 1) {
      const coordinateLabel = getCoordinateLabelXY(rowIndex, columnIndex, t);
      columns.push(
        <TableCell
          key={`${rowIndex}_${columnIndex}`}
          displaySize={displaySize}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          rowLabel={getRowLabel(rowIndex)}
          columnLabel={getColumnLabel(columnIndex, t)}
          bombedCoordinate={bombedCoordinateMap.get(coordinateLabel)}
          shipName={shipCoordinateLabelMap.get(coordinateLabel)}
          onDropBomb={onDropBomb}
        />
      );
    }
    return columns;
  };

  const createRows = (): Array<ReactElement> => {
    const rows = new Array<ReactElement>();
    for (let rowIndex = 0; rowIndex <= grid.size.y; rowIndex += 1) {
      rows.push(
        <div key={rowIndex} className={styles.tr}>
          {createColumns(rowIndex)}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className={clsx(styles.oceanGrid, styles[displaySize], className)}>
      <div ref={tableRef} className={styles.table}>
        <div className={styles.tbody}>{createRows()}</div>
      </div>
      {grid.ships
        .filter((ship) => !isOpponentGrid || sunkShipIdSet.has(ship.id))
        .map((ship, idx) => (
          <PlacedShip key={idx} ship={ship} cellSize={cellSize} />
        ))}
    </div>
  );
};

export enum OceanGridDisplaySize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}
