import { ConfigurationPage } from "battleship-ui/components";

export const App = () => {
  return (
    <ConfigurationPage
      onStartGame={(game) => {
        console.info(JSON.stringify(game, null, 2));
      }}
    />
  );
};

export default App;
