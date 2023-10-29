import Exchange, { Token } from "../models/exchange";
import TradingPairResponse from "../response/trading_pair_response";

export default class Splitter {

  static exchanges: Exchange[] = [];


  private static init() {
    this.exchanges.push(new Exchange("gate", "_"));
    this.exchanges.push(new Exchange("binance", ""));
    this.exchanges.push(new Exchange("bitrue", ""));
    this.exchanges.push(new Exchange("okx", "", true));
    this.exchanges.push(new Exchange("huobi", "", true));
  }

  static async split() {
    this.init();

    await Promise.all(this.exchanges.map(async (exc) => {
      await exc.getBaseQuotes();
    }));

    const tokens: Token[][] = this.exchanges.map(exc => exc.tokens);

    const outputPairs: Token[][] = this.findRepeatedBaseAndQuoteElements(tokens);

    for(let i = 0; i < this.exchanges.length; i ++) {
      this.exchanges[i].tokens = outputPairs[i];
    }

    console.log(outputPairs);

    await Promise.all(this.exchanges.map(async (exchange) => {
      return exchange.getOrderBooks(exchange.tokens);
    }));
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
