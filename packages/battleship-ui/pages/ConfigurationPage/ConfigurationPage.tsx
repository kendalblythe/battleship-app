import { useEffect, useState } from 'react';
import { createGrid, getGridConfigs, startGame } from 'battleship-engine/api';
import { Game, Grid } from 'battleship-engine/types';
import { Button } from '../../components/Button';
import { OceanGrid, OceanGridDisplaySize } from '../../components/OceanGrid';
import { PageHeading } from '../../components/PageHeading';
import { Select } from '../../components/Select';
import { Spacer } from '../../components/Spacer';
import { useWindowSize, WindowSize } from '../../hooks/useWindowSize';
import { useTranslate } from '../../locales';
import { getGridConfigLabel } from '../../utils';
import styles from './ConfigurationPage.module.scss';

export interface ConfigurationPageProps {
  gridConfigId?: string;
  onStartGame: (game: Game) => void;
}

export const ConfigurationPage = ({
  gridConfigId: initialGridConfigId,
  onStartGame,
}: ConfigurationPageProps) => {
  const t = useTranslate();
  const windowSize = useWindowSize();

  const [gridConfigs] = useState(getGridConfigs());
  const [gridConfigId, setGridConfigId] = useState(initialGridConfigId ?? gridConfigs[0].id);
  const [grid, setGrid] = useState(createGrid(gridConfigId));

  useEffect(() => setGrid(createGrid(gridConfigId)), [gridConfigId]);

  const gridConfigOptions = gridConfigs.map((gridConfig) => ({
    value: gridConfig.id,
    label: getGridConfigLabel(gridConfig.id, t),
  }));

  const onShuffleButtonClick = () => setGrid(createGrid(gridConfigId));
  const onPlayButtonClick = () => onStartGame(startGame(grid));

  return (
    <div className={styles.configurationPage}>
      <header>
        <PageHeading text={t('configurationPage.title')} />
        <Select
          value={gridConfigId}
          options={gridConfigOptions}
          onChange={({ value }) => setGridConfigId(value)}
        />
        <Spacer />
        <Button className={styles.shuffleButton} onClick={onShuffleButtonClick}>
          {t('configurationPage.shuffleShips.button.label')}
        </Button>
        <Button
          className={styles.shuffleIconButton}
          variant="icon"
          title={t('configurationPage.shuffleShips.button.label')}
          onClick={onShuffleButtonClick}
        >
          <img className={styles.shuffleIcon} />
        </Button>
        <Button className={styles.playButton} variant="primary" onClick={onPlayButtonClick}>
          {t('configurationPage.playGame.button.label')}
        </Button>
        <Button
          className={styles.playIconButton}
          variant="icon"
          title={t('configurationPage.playGame.button.label')}
          onClick={onPlayButtonClick}
        >
          <img className={styles.playIcon} />
        </Button>
      </header>
      <main>
        <OceanGrid
          className={styles.oceanGrid}
          grid={grid}
          displaySize={getGridDisplaySize(grid, windowSize)}
        />
      </main>
    </div>
  );
};

export default ConfigurationPage;

const getGridDisplaySize = (grid: Grid, windowSize: WindowSize): OceanGridDisplaySize => {
  const { width, height } = windowSize;
  const minWindowSizeDimension = Math.min(width, height);
  const isSmallGrid = grid.size.x <= 6;
  if (minWindowSizeDimension <= 512) {
    return isSmallGrid ? 'medium' : 'small';
  } else if (minWindowSizeDimension <= 768) {
    return isSmallGrid ? 'large' : 'medium';
  } else {
    return 'large';
  }
};
