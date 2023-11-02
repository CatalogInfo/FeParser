import './App.css'
import Splitter from './splitter/splitter';
import SpreadFinder from './spread_finder';

function App() {
  if(Splitter.exchanges.length === 0) {
    Splitter.init();
  }

  async function callApi() {

    const v = true;
    while(v) {
      console.log(await SpreadFinder.compareExchanges())
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
