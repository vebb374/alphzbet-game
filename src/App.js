import Game from "./components/game/game.jsx";

function App() {
  return (
    <div className="App">
      <h2>Type the Alphabet</h2>
      <span>
        typing game to see how fast you type. Timer start when you do :)
      </span>
      <Game />
    </div>
  );
}

export default App;
