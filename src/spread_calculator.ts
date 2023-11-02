import { Token } from "./models/exchange";

export default class SpreadCalculator {
  static calculateSpread(token1: Token, token2: Token) {
    const bid1 = token1.bid;
    const bid2 = token2.bid;
    const ask1 = token1.ask;
    const ask2 = token2.ask;


    if (bid1 > ask2) {
      return this.percentBetweenPrices(bid1, ask2);
    }
    if (bid2 > ask1) {
      return this.percentBetweenPrices(bid2, ask1);
    }

    return 0;
  }

  static isNotNull(bid: number, ask: number) {
    return bid !== 0.0 && ask !== 0.0;
  }

  private static percentBetweenPrices(
    firstTokenPrice: number,
    secondTokenPrice: number
  ) {
    return (
      (Math.abs(firstTokenPrice - secondTokenPrice) / secondTokenPrice) * 100
    );
  }
}