import { ReactElement, useLayoutEffect, useRef } from 'react';
import { Game, Grid } from 'battleship-engine/types';
import { Button, ButtonVariant } from '../Button';
import { OceanGrid, OceanGridDisplaySize } from '../OceanGrid';
import { PageHeading } from '../PageHeading';
import { Spacer } from '../Spacer';
import { useTranslate } from '../../locales';
import { getShipLabel, getSunkShipIds } from '../utils';
import styles from './GamePage.module.scss';
import { dropBomb } from 'battleship-engine/api';

export interface GamePageProps {
  game: Game;
  onSetGame: (game?: Game) => void;
}

export const GamePage = ({ game, onSetGame }: GamePageProps) => {
  const t = useTranslate();

  // sync grid container widths with grid table width
  const tableRef = useRef<HTMLTableElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const opponentContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (tableRef.current && playerContainerRef.current && opponentContainerRef.current) {
      const width = tableRef.current.offsetWidth;
      if (width > 0) {
        playerContainerRef.current.style.width = `${width}px`;
        opponentContainerRef.current.style.width = `${width}px`;
      }
    }
  }, [tableRef, playerContainerRef, opponentContainerRef]);

  const onDropBomb = (x: number, y: number): void => {
    dropBomb(game, { x, y });
    onSetGame({ ...game });
  };

  const gameOver =
    game.winningPlayerNum === game.playerGrid.playerNum ||
    game.winningPlayerNum === game.opponentGrid.playerNum;

  let displaySize;
  if (game.playerGrid.size.x > 8) {
    displaySize = OceanGridDisplaySize.Small;
  } else if (game.playerGrid.size.x < 7) {
    displaySize = OceanGridDisplaySize.Large;
  } else {
    displaySize = OceanGridDisplaySize.Medium;
  }

  const getSunkShips = (grid: Grid): ReactElement | null => {
    const sunkShipIds = getSunkShipIds(grid);
    if (!sunkShipIds.length) return null;
    const fieldLabel = t('gamePage.sunkShips.field.label');
    const sunkShips = sunkShipIds
      .map((shipId) => getShipLabel(shipId, t))
      .join(t('gamePage.sunkShips.delimiter.text'));
    return <span className={styles.sunkenShips}>{`${fieldLabel} ${sunkShips}`}</span>;
  };

  return (
    <div className={styles.gamePage}>
      <header>
        <PageHeading text={gameOver ? t('gamePage.gameOver.title') : t('gamePage.title')} />
        <Spacer />
        <Button
          text={
            gameOver ? t('gamePage.startOver.button.label') : t('gamePage.quitGame.button.label')
          }
          variant={ButtonVariant.Primary}
          onClick={() => onSetGame()}
        />
      </header>
      <main>
        <div ref={playerContainerRef} className={styles.verticalLayout}>
          <h3>
            {t('gamePage.playerGrid.header.title')}
            {game.winningPlayerNum === game.playerGrid.playerNum &&
              t('gamePage.winnerGrid.header.suffix.title')}
          </h3>
          <OceanGrid tableRef={tableRef} grid={game.playerGrid} displaySize={displaySize} />
          {getSunkShips(game.playerGrid)}
        </div>
        <div ref={opponentContainerRef} className={styles.verticalLayout}>
          <h3>
            {t('gamePage.opponentGrid.header.title')}
            {game.winningPlayerNum === game.opponentGrid.playerNum &&
              t('gamePage.winnerGrid.header.suffix.title')}
          </h3>
          {gameOver ? (
            <OceanGrid grid={game.opponentGrid} displaySize={displaySize} />
          ) : (
            <OceanGrid
              grid={game.opponentGrid}
              isOpponentGrid
              displaySize={displaySize}
              onDropBomb={onDropBomb}
            />
          )}
          {getSunkShips(game.opponentGrid)}
        </div>
      </main>
    </div>
  );
};

export default GamePage;
