import { useState } from 'react';

import { Game } from 'battleship-engine/types';
import { useLocalStorageState } from 'battleship-ui/hooks';
import { ConfigurationPage, GamePage } from 'battleship-ui/pages';

export const App = () => {
  const [gridConfigId, setGridConfigId] = useState<string>();
  const [game, setGame, isLoaded] = useLocalStorageState<Game | undefined>(
    'battleship-react-app-game',
    undefined
  );

  const onGameChange = (nextGame?: Game) => {
    if (nextGame) {
      setGridConfigId(nextGame.playerGrid.gridConfigId);
    } else if (game) {
      setGridConfigId(game.playerGrid.gridConfigId);
    }

    setGame(nextGame);
  };

  return isLoaded ? (
    game ? (
      <GamePage game={game} onGameChange={onGameChange} />
    ) : (
      <ConfigurationPage gridConfigId={gridConfigId} onStartGame={onGameChange} />
    )
  ) : null;
};

export default App;
