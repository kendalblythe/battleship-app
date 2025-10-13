import { useEffect, useEffectEvent, useState } from 'react';

import { Game } from 'battleship-engine/types';
import { useLocalStorageState } from 'battleship-ui/hooks';
import { ConfigurationPage, GamePage } from 'battleship-ui/pages';

export const App = () => {
  const [gridConfigId, setGridConfigId] = useState<string>();
  const [game, setGame, isLoaded] = useLocalStorageState<Game | undefined>(
    'battleship-react-app-game',
    undefined
  );

  const onGameChange = useEffectEvent((game: Game | undefined) => {
    if (game) setGridConfigId(game.playerGrid.gridConfigId);
  });

  useEffect(() => onGameChange(game), [game]);

  return isLoaded ? (
    game ? (
      <GamePage game={game} onGameChange={setGame} />
    ) : (
      <ConfigurationPage gridConfigId={gridConfigId} onStartGame={setGame} />
    )
  ) : null;
};

export default App;
