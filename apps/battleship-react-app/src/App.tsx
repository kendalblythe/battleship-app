import { useEffect, useState } from 'react';
import { useLocalStorageState } from 'battleship-ui/hooks';
import { ConfigurationPage, GamePage } from 'battleship-ui/pages';
import { Game } from 'battleship-engine/types';

export const App = () => {
  const [gridConfigId, setGridConfigId] = useState<string>();
  const [game, setGame, isLoaded] = useLocalStorageState<Game | undefined>(
    'battleship-react-app-game',
    undefined
  );

  useEffect(() => {
    console.error(game);
    if (game) setGridConfigId(game.playerGrid.gridConfigId);
  }, [game]);

  return isLoaded ? (
    game ? (
      <GamePage game={game} onSetGame={setGame} />
    ) : (
      <ConfigurationPage gridConfigId={gridConfigId} onStartGame={setGame} />
    )
  ) : null;
};

export default App;
