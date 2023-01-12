import { ReactElement, useLayoutEffect, useRef } from 'react';
import { Game, Grid } from 'battleship-engine/types';
import { Button } from '../../components/Button';
import { OceanGrid, OceanGridDisplaySize } from '../../components/OceanGrid';
import { PageHeading } from '../../components/PageHeading';
import { Spacer } from '../../components/Spacer';
import useWindowSize from '../../hooks/useWindowSize';
import { useTranslate } from '../../locales';
import { getShipLabel, getSunkShipIds } from '../../utils';
import styles from './GamePage.module.scss';
import { dropPlayerBomb } from 'battleship-engine/api';

export interface GamePageProps {
  game: Game;
  onSetGame: (game?: Game) => void;
}

export const GamePage = ({ game, onSetGame }: GamePageProps) => {
  const t = useTranslate();
  const { width, height } = useWindowSize();
  const minWindowSizeDimension = Math.min(width, height);

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
    dropPlayerBomb(game, { x, y });
    onSetGame({ ...game });
  };

  const gameOver =
    game.winningPlayerNum === game.playerGrid.playerNum ||
    game.winningPlayerNum === game.opponentGrid.playerNum;

  let displaySize: OceanGridDisplaySize;
  if (game.playerGrid.size.x > 8) {
    displaySize = 'small';
  } else {
    displaySize = minWindowSizeDimension >= 512 ? 'large' : 'medium';
  }

  const getSunkShips = (grid: Grid): ReactElement | null => {
    const sunkShipIds = getSunkShipIds(grid);
    if (!sunkShipIds.length) return null;
    const fieldLabel = t('gamePage.sunkShips.field.label');
    const sunkShips = sunkShipIds
      .map((shipId) => getShipLabel(shipId, t))
      .join(t('gamePage.sunkShips.delimiter.text'));
    return <span className={styles.sunkShips}>{`${fieldLabel} ${sunkShips}`}</span>;
  };

  return (
    <div className={styles.gamePage}>
      <header>
        <PageHeading text={gameOver ? t('gamePage.gameOver.title') : t('gamePage.title')} />
        <Spacer />
        <Button variant="primary" onClick={() => onSetGame()}>
          {gameOver ? t('gamePage.startOver.button.label') : t('gamePage.quitGame.button.label')}
        </Button>
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
