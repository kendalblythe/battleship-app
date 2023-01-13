import { ReactElement } from 'react';
import { Game, Grid } from 'battleship-engine/types';
import { Button } from '../../components/Button';
import { OceanGrid, GridDisplaySize, getGridWidth } from '../../components/OceanGrid';
import { PageHeading } from '../../components/PageHeading';
import { Spacer } from '../../components/Spacer';
import { useWindowSize, WindowSize } from '../../hooks/useWindowSize';
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
  const windowSize = useWindowSize();
  const { playerGrid, opponentGrid, winningPlayerNum } = game;
  const displaySize = getGridDisplaySize(playerGrid, windowSize);

  const onDropBomb = (x: number, y: number): void => {
    dropPlayerBomb(game, { x, y });
    onSetGame({ ...game });
  };

  const gameOver =
    winningPlayerNum === playerGrid.playerNum || winningPlayerNum === opponentGrid.playerNum;

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
        <div
          className={styles.verticalLayout}
          style={{
            width: `${getGridWidth(playerGrid, displaySize)}px`,
          }}
        >
          <h3>
            {t('gamePage.playerGrid.header.title')}
            {winningPlayerNum === playerGrid.playerNum &&
              t('gamePage.winnerGrid.header.suffix.title')}
          </h3>
          <OceanGrid grid={playerGrid} displaySize={displaySize} />
          {getSunkShips(playerGrid)}
        </div>
        <div
          className={styles.verticalLayout}
          style={{
            width: `${getGridWidth(opponentGrid, displaySize)}px`,
          }}
        >
          <h3>
            {t('gamePage.opponentGrid.header.title')}
            {winningPlayerNum === opponentGrid.playerNum &&
              t('gamePage.winnerGrid.header.suffix.title')}
          </h3>
          {gameOver ? (
            <OceanGrid grid={opponentGrid} displaySize={displaySize} />
          ) : (
            <OceanGrid
              grid={opponentGrid}
              isOpponentGrid
              displaySize={displaySize}
              onDropBomb={onDropBomb}
            />
          )}
          {getSunkShips(opponentGrid)}
        </div>
      </main>
    </div>
  );
};

export default GamePage;

const getGridDisplaySize = (grid: Grid, windowSize: WindowSize): GridDisplaySize => {
  const { width, height } = windowSize;
  const minWindowSizeDimension = Math.min(width, height);
  const isSmallGrid = grid.size.x <= 6;
  if (minWindowSizeDimension <= 512) {
    return 'small';
  } else if (minWindowSizeDimension <= 800) {
    return isSmallGrid ? 'medium' : 'small';
  } else {
    return isSmallGrid ? 'large' : 'small';
  }
};
