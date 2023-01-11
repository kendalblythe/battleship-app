import { useState } from 'react';
import { Game } from 'battleship-engine/types';
import { ConfigurationPage, GamePage } from 'battleship-ui/pages';

export const App = () => {
  const [gridConfigId, setGridConfigId] = useState<string>();
  const [game, setGame] = useState<Game>();

  const onStartGame = (game: Game) => {
    setGridConfigId(game.playerGrid.gridConfigId);
    setGame(game);
  };

  return game ? (
    <GamePage game={game} onSetGame={setGame} />
  ) : (
    <ConfigurationPage gridConfigId={gridConfigId} onStartGame={onStartGame} />
  );
};

export default App;
