import { useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Game } from "battleship-engine/types";

// Dynamic import with ssr = false resolves React hydration error.
// https://stackoverflow.com/questions/66374123/warning-text-content-did-not-match-server-im-out-client-im-in-div
const ConfigurationPage = dynamic(
  () => import("battleship-ui/components/ConfigurationPage/ConfigurationPage"),
  {
    ssr: false,
  }
);
const GamePage = dynamic(
  () => import("battleship-ui/components/GamePage/GamePage"),
  {
    ssr: false,
  }
);

export default function Home() {
  const [gridConfigId, setGridConfigId] = useState<string>();
  const [game, setGame] = useState<Game>();

  const onStartGame = (game: Game) => {
    setGridConfigId(game.playerGrid.gridConfigId);
    setGame(game);
  };

  return (
    <>
      <Head>
        <title>Battleship Next.js App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="images/favicon.ico" />
      </Head>
      {game ? (
        <GamePage game={game} onSetGame={setGame} />
      ) : (
        <ConfigurationPage
          gridConfigId={gridConfigId}
          onStartGame={onStartGame}
        />
      )}
    </>
  );
}
