import TelegramApi from "./api/telegram_api";
import Exchange, { Token } from "./models/exchange";
import Splitter from "./splitter/splitter";

export default class SpreadFinder {
  static async compareExchanges() {
    await Splitter.split();

    for(const exchange of Splitter.exchanges) {
      for (const exchange1 of Splitter.exchanges) {
        if (exchange.name === exchange1.name) {
          continue;
        }

        for(const token of exchange.tokens) {
          for(const token1 of exchange1.tokens) {
            if(token.base.toUpperCase() === token1.base.toUpperCase()) {
              this.makeMessage(token, token1, exchange, exchange1);
            }
          }
        }
      } 
    }
  }

  static makeMessage(
    token1: Token,
    token2: Token,
    exchange1: Exchange,
    exchange2: Exchange
) {
  const spread = this.findSpread(token1, token2);
  if(spread > 2 && spread < 200) {
      const message = {
      symbol: token1.symbol,
      exchange1: exchange1.name,
      exchange2: exchange2.name,
      bid1: token1.bid,
      ask1: token1.ask,
      bid2: token2.bid,
      ask2: token2.ask,
      spread: spread.toFixed(2),
    };
    console.log(message);
    let formattedMessage = `
    Symbol: ${message.symbol}
    ${message.exchange1}: ${exchange1.link + token1.base + exchange1.linkSplitter + token1.quote}
    ${message.exchange2}: ${exchange2.link + token2.base + exchange2.linkSplitter + token2.quote}
    Buy ${message.ask1}
    Sell ${message.bid2}
    Spread: ${message.spread}%25
    `;
    if(message.bid1 > message.ask2) {
      formattedMessage = 
      `Symbol: ${message.symbol}
      ${message.exchange1}: ${exchange1.link + token1.base + exchange1.linkSplitter + token1.quote}
      ${message.exchange2}: ${exchange2.link + token2.base + exchange2.linkSplitter + token2.quote}
      Sell ${message.bid1}
      Buy ${message.ask2}
      Spread: ${message.spread}%25
      `;
  }
 
    TelegramApi.sendMessage(formattedMessage);
      console.log(formattedMessage);
  }
    
}

  static hasSpread(token: Token, token1: Token) {
    const bid1 = token.bid;
    const bid2 = token1.bid;
    const ask1 = token.ask;
    const ask2 = token1.ask;

    return this.isNotNull(bid1, ask2) && bid1 > ask2 || this.isNotNull(bid2, ask1) && bid2 > ask1;
  }

  static findSpread(token1: Token, token2: Token) {
    const bid1 = token1.bid;
    const bid2 = token2.bid;
    const ask1 = token1.ask;
    const ask2 = token2.ask;

    if(bid1 > ask2) {
        return this.percentBetweenPrices(bid1, ask2);
    }
    if(bid2 > ask1) {
        return this.percentBetweenPrices(bid2, ask1);
    }

    return 0;
  }

  static isNotNull(bid: number, ask: number) {
    return bid !== 0.0 && ask !== 0.0;
  }

  static percentBetweenPrices(firstTokenPrice: number, secondTokenPrice: number) {
    let fToken = firstTokenPrice;
    let sToken = secondTokenPrice;

    if (firstTokenPrice < secondTokenPrice) {
        fToken = secondTokenPrice;
        sToken = firstTokenPrice;
    }

    return (Math.abs(fToken - sToken) / sToken * 100);
  }

  static findExchangePrices(token1: Token, token2: Token, name1: string, name2: string) {
    const bid1 = token1.bid;
    const bid2 = token2.bid;
    const ask1 = token1.ask;
    const ask2 = token2.ask;

    if(bid1 > ask2) {
        return {name: name1, name1: name2, ask2: ask2, bid1: bid1};
    }

    return {name: name1, name1: name2, ask1: ask1, bid2: bid2};
}
}