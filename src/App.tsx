import './App.css'
import ExhangeApi from './api/exchange_api';

function App() {

  async function callApi() {
    const api: ExhangeApi = new ExhangeApi();
    console.log(await api.getTradingPairs("binance"));
    // console.log(api.getOrderBooks("gate"));

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
