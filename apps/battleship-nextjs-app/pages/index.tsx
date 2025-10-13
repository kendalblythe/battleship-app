import { useEffect, useEffectEvent, useState } from 'react';

import dynamic from 'next/dynamic';
import Head from 'next/head';

import { Game } from 'battleship-engine/types';
import { useLocalStorageState } from 'battleship-ui/hooks';

// Dynamic import with ssr = false resolves React hydration error.
// https://stackoverflow.com/questions/66374123/warning-text-content-did-not-match-server-im-out-client-im-in-div
const ConfigurationPage = dynamic(() => import('battleship-ui/pages/ConfigurationPage'), {
  ssr: false,
});
const GamePage = dynamic(() => import('battleship-ui/pages/GamePage'), {
  ssr: false,
});

export default function Home() {
  const [gridConfigId, setGridConfigId] = useState<string>();
  const [game, setGame, isLoaded] = useLocalStorageState<Game | undefined>(
    'battleship-nextjs-app-game',
    undefined
  );

  const onGameChange = useEffectEvent((game: Game | undefined) => {
    if (game) setGridConfigId(game.playerGrid.gridConfigId);
  });

  useEffect(() => onGameChange(game), [game]);

  return (
    <>
      <Head>
        <title>Battleship Next.js App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/ship.png" />
      </Head>
      {isLoaded ? (
        game ? (
          <GamePage game={game} onGameChange={setGame} />
        ) : (
          <ConfigurationPage gridConfigId={gridConfigId} onStartGame={setGame} />
        )
      ) : null}
    </>
  );
}
