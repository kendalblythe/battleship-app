import { useEffect, useState } from "react";
import { createGrid, getGridConfigs, startGame } from "battleship-engine/api";
import { Game } from "battleship-engine/types";
import { Button, ButtonVariant } from "../Button";
import { OceanGrid, OceanGridDisplaySize } from "../OceanGrid";
import { PageHeading } from "../PageHeading";
import { Select } from "../Select/Select";
import { Spacer } from "../Spacer";
import { useTranslate } from "../../locales/hooks";
import { getGridConfigLabel } from "../../utils/grid";
import styles from "./ConfigurationPage.module.scss";

export interface ConfigurationPageProps {
  gridConfigId?: string;
  onStartGame: (game: Game) => void;
}

export const ConfigurationPage = ({
  gridConfigId: initialGridConfigId,
  onStartGame,
}: ConfigurationPageProps) => {
  const t = useTranslate();

  const [gridConfigs] = useState(getGridConfigs());
  const [gridConfigId, setGridConfigId] = useState(
    initialGridConfigId ?? gridConfigs[0].id
  );
  const [grid, setGrid] = useState(createGrid(gridConfigId));

  useEffect(() => setGrid(createGrid(gridConfigId)), [gridConfigId]);

  const gridConfigOptions = gridConfigs.map((gridConfig) => ({
    value: gridConfig.id,
    label: getGridConfigLabel(gridConfig.id, t),
  }));

  return (
    <div className={styles.configurationPage}>
      <header>
        <PageHeading text={t("configurationPage.title")} />
        <Select
          value={gridConfigId}
          options={gridConfigOptions}
          onChange={({ value }) => setGridConfigId(value)}
        />
        <Spacer />
        <Button
          text={t("configurationPage.shuffleShips.button.label")}
          onClick={() => setGrid(createGrid(gridConfigId))}
        />
        <Button
          text={t("configurationPage.startGame.button.label")}
          variant={ButtonVariant.Primary}
          onClick={() => onStartGame(startGame(grid))}
        />
      </header>
      <main>
        <OceanGrid
          className={styles.oceanGrid}
          grid={grid}
          displaySize={OceanGridDisplaySize.Medium}
        />
      </main>
    </div>
  );
};

export default ConfigurationPage;
