import './App.css'
import SpreadFinder from './spread_finder';

function App() {
  async function callApi() {
    const infinity = true;

    while(infinity) {
      await SpreadFinder.findSpreads();
    }
  }

  return (
    <>
    <div className="h-screen w-screen flex justify-center items-center">
      <button
        className="font-bold bg-indigo-300 rounded-2xl hover:bg-indigo-400 shadow-xl px-3 py-1"
        onClick={callApi}
      >
        Run devil machine!
      </button>
    </div>
  </>
  )
}

export default App
