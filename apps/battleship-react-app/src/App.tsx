import { ConfigurationPage } from "battleship-ui/components";

export const App = () => {
  return (
    <ConfigurationPage
      onStartGame={(grid) => {
        console.info(JSON.stringify(grid, null, 2));
      }}
    />
  );
};

export default App;
