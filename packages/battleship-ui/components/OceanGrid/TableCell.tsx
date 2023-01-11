import { KeyboardEvent } from 'react';
import { clsx } from 'clsx';
import { BombedCoordinate } from 'battleship-engine/types';
import styles from './TableCell.module.scss';

export interface TableCellProps {
  displaySize: string;
  rowIndex: number;
  columnIndex: number;
  rowLabel: string;
  columnLabel: string;
  bombedCoordinate?: BombedCoordinate;
  shipName?: string;
  onDropBomb?: (x: number, y: number) => void;
}

/**
 * Ocean grid table cell.
 */
export const TableCell = ({
  displaySize,
  rowIndex,
  columnIndex,
  rowLabel,
  columnLabel,
  bombedCoordinate,
  shipName,
  onDropBomb,
}: TableCellProps) => {
  const cellClassNames = clsx(styles.tableCell, styles[displaySize]);
  const headerClassNames = clsx(cellClassNames, styles.headerCell);

  const onKeyDown = (event: KeyboardEvent): void => {
    const getRowButtons = (): Array<HTMLButtonElement> =>
      Array.from(document.querySelectorAll(`button[data-row="${rowIndex}"]`));

    const getColumnButtons = (): Array<HTMLButtonElement> =>
      Array.from(document.querySelectorAll(`button[data-col="${columnIndex}"]`));

    const getButtonArrayIndex = (buttons: Array<Element>): number => {
      return buttons.findIndex((button) => {
        const buttonRowIdx = button.getAttribute('data-row');
        const buttonColIdx = button.getAttribute('data-col');
        return buttonRowIdx === rowIndex.toString() && buttonColIdx === columnIndex.toString();
      });
    };

    const focusButton = (button: HTMLButtonElement): void => {
      button.focus();
      event.stopPropagation();
      event.preventDefault();
    };

    const focusPreviousButton = (buttons: Array<HTMLButtonElement>): void => {
      let index = getButtonArrayIndex(buttons);
      if (index > 0) {
        focusButton(buttons[--index]);
      }
    };

    const focusNextButton = (buttons: Array<HTMLButtonElement>): void => {
      let index = getButtonArrayIndex(buttons);
      if (index < buttons.length - 1) {
        focusButton(buttons[++index]);
      }
    };

    switch (event.key) {
      case 'ArrowLeft':
        focusPreviousButton(getRowButtons());
        break;
      case 'ArrowUp':
        focusPreviousButton(getColumnButtons());
        break;
      case 'ArrowRight':
        focusNextButton(getRowButtons());
        break;
      case 'ArrowDown':
        focusNextButton(getColumnButtons());
        break;
    }
  };

  const coordinateLabel = rowIndex && columnIndex ? columnLabel + rowLabel : null;
  if (coordinateLabel) {
    const tooltip = shipName || coordinateLabel;

    // coordinate cell
    if (bombedCoordinate) {
      // bombed coordinate cell
      const bombedForwardSlashClassName = bombedCoordinate.isHit
        ? styles.hitForwardSlash
        : styles.missForwardSlash;
      const bombedBackslashClassName = bombedCoordinate.isHit
        ? styles.hitBackslash
        : styles.missBackslash;
      return (
        <div className={cellClassNames} title={tooltip}>
          <div className={bombedForwardSlashClassName} />
          <div className={bombedBackslashClassName} />
        </div>
      );
    } else if (onDropBomb) {
      // bombable coordinate cell
      return (
        <div className={cellClassNames} title={tooltip}>
          <button
            type="button"
            aria-label={coordinateLabel}
            data-row={rowIndex}
            data-col={columnIndex}
            onClick={(): void => onDropBomb(columnIndex, rowIndex)}
            onKeyDown={onKeyDown}
          >
            {' '}
          </button>
        </div>
      );
    } else {
      // non-bombable coordinate cell
      return <div className={cellClassNames} title={tooltip} />;
    }
  } else if (rowIndex) {
    // header row cell
    return (
      <div className={headerClassNames}>
        <span>{rowLabel}</span>
      </div>
    );
  } else if (columnIndex) {
    // header column cell
    return (
      <div className={headerClassNames}>
        <span>{columnLabel}</span>
      </div>
    );
  } else {
    // empty header cell
    return <div className={headerClassNames} />;
  }
};
