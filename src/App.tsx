import './App.css'
// import ExhangeApi from './api/exchange_api';
// import Splitter from './splitter/splitter';
// import Exchange from './models/exchange';
import SpreadFinder from './spread_finder';

function App() {

  async function callApi() {
    // const api: ExhangeApi = new ExhangeApi();
    // console.log(await api.getTradingPairs("binance"));
    // console.log(api.getOrderBooks("gate"));
    // console.log(await new Exchange("binance", "").getBaseQuotes());
    console.log(await SpreadFinder.compareExchanges())

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
