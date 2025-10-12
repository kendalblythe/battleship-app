import { useEffect, useState } from 'react';

import { Game } from 'battleship-engine/types';
import { useLocalStorageState } from 'battleship-ui/hooks';
import { ConfigurationPage, GamePage } from 'battleship-ui/pages';

export const App = () => {
  const [gridConfigId, setGridConfigId] = useState<string>();
  const [game, setGame, isLoaded] = useLocalStorageState<Game | undefined>(
    'battleship-react-app-game',
    undefined
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (game) setGridConfigId(game.playerGrid.gridConfigId);
  }, [game]);

  return isLoaded ? (
    game ? (
      <GamePage game={game} onGameChange={setGame} />
    ) : (
      <ConfigurationPage gridConfigId={gridConfigId} onStartGame={setGame} />
    )
  ) : null;
};

export default App;
