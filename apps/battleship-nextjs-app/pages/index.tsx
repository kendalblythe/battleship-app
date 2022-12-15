import dynamic from "next/dynamic";
import Head from "next/head";

// Dynamic import with ssr = false resolves React hydration error.
// https://stackoverflow.com/questions/66374123/warning-text-content-did-not-match-server-im-out-client-im-in-div
const ConfigurationPage = dynamic(
  () => import("battleship-ui/components/ConfigurationPage/ConfigurationPage"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Battleship Next.js App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="images/favicon.ico" />
      </Head>
      <ConfigurationPage
        onStartGame={(game) => {
          console.info(JSON.stringify(game, null, 2));
        }}
      />
    </>
  );
}
