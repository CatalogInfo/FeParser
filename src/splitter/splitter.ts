import Exchange, { Token } from "../models/exchange";
// import TradingPairResponse from "../response/trading_pair_response";

export default class Splitter {

  static exchanges: Exchange[] = [];


  static init() {
    this.exchanges.push(new Exchange("gate", "_", "https://www.gate.io/trade/", "_")); // BASE_QUOTE, ++
    this.exchanges.push(new Exchange("binance", "", "https://www.binance.com/en/trade/", "")); // doesn't matter
    this.exchanges.push(new Exchange("bitrue", "", "https://www.bitrue.com/trade/", "_")); // BASEQOUTE api, ++
    this.exchanges.push(new Exchange("okx", "-", "https://www.okx.com/trade-spot/", "-")); // BASE-QUOTE api, ++
    this.exchanges.push(new Exchange("huobi", "", "https://www.htx.com/en-us/trade/", "_", true)); // basequote api, base_quote link dolboebi
    // this.exchanges.push(new Exchange("mexc", "", "https://www.mexc.com/exchange/", "_")); //BASEQUOTE api, BASE_QUOTE link tozhe dauni
    // this.exchanges.push(new Exchange("bybit", "", "https://www.bybit.com/en-US/trade/spot/", "/")); // BASEQUOTE , BASE/QUOTE link eblani

  }

  static async split() {
    if(this.exchanges.length === 0) {
      this.init();
    }

    await Promise.all(this.exchanges.map(async (exc) => {
      await exc.getBaseQuotes();
    }));

    const tokens: Token[][] = this.exchanges.map(exc => exc.tokens);

    const outputPairs: Token[][] = this.findRepeatedBaseAndQuoteElements(tokens);

    for(let i = 0; i < this.exchanges.length; i ++) {
      this.exchanges[i].tokens = outputPairs[i];
    }


    await Promise.all(this.exchanges.map(async (exchange) => {
      await exchange.getOrderBooks(exchange.tokens);
    }));

    console.log(this.exchanges[0].tokens);
  }

  static findRepeatedBaseAndQuoteElements(arrayOfPairs: Token[][]): Token[][] {
    const pairCounts: { [key: string]: number } = {};
    const repeatedPairs: Set<string> = new Set();

    // Count the occurrences of each pair (base and quote) in the arrays
    for (const pairs of arrayOfPairs) {
        for (const pair of pairs) {
            const { base, quote } = pair;
            const key = `${base}_${quote}`;
            if (key in pairCounts) {
                pairCounts[key]++;
            } else {
                pairCounts[key] = 1;
            }
        }
    }

    // Identify repeated pairs
    for (const key in pairCounts) {
        if (pairCounts[key] > 1) {
            repeatedPairs.add(key);
        }
    }

    // Create the output arrays for each input array
    const outputArray: Token[][] = [];
    for (const pairs of arrayOfPairs) {
        const outputPairs = pairs.filter(pair => {
            const key = `${pair.base}_${pair.quote}`;
            return repeatedPairs.has(key);
        });
        outputArray.push(outputPairs);
    }

    return outputArray;
  }
}
