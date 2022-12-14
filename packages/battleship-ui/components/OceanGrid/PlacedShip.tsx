import { Ship } from "battleship-engine/types";
import { useTranslate } from "../../locales/hooks";
import { getShipLabel } from "../../utils/text";
import styles from "./PlacedShip.module.scss";

export interface PlacedShipProps {
  ship: Ship;
  cellSize: number;
}

export const PlacedShip = ({ ship, cellSize }: PlacedShipProps) => {
  const t = useTranslate();

  if (!ship.coordinates) return null;

  const horizontal =
    ship.length === 1 || ship.coordinates[0].y === ship.coordinates[1].y;
  const marginSize = 1;
  const shipSize = cellSize * ship.length - marginSize * 2;
  const top = cellSize * ship.coordinates[0].y + marginSize + 1;
  const left = cellSize * ship.coordinates[0].x + marginSize + 1;
  const divStyle = {
    top,
    left,
    width: horizontal ? shipSize : cellSize - marginSize * 2,
    height: horizontal ? cellSize - marginSize * 2 : shipSize,
  };

  return (
    <div
      className={styles.placedShip}
      style={divStyle}
      title={getShipLabel(ship.id, t)}
    />
  );
};
