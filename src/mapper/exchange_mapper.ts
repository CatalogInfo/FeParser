import { Token } from "../models/exchange";
import TradingPairResponse from "../response/trading_pair_response";
import SymbolUtils from "../utils/symbol_utils";
import OrderBookResponse from "../response/order_book_response";

export default class ExchangeMapper {
  static mapQuoteBaseToTokens(baseSymbols: TradingPairResponse[], tokens: Token[]) {
    this.clearArray(tokens);
    return baseSymbols.map(symbol => {
      return tokens.push({
        symbol: symbol.symbol.toUpperCase(),
        base: symbol.base.toUpperCase(),
        quote: symbol.quote.toUpperCase(),
        bid: 0,
        ask: 0
      });
    })
  }

  static clearArray<T>(array: T[]) {
    while (array.length > 0) {
      array.pop();
    }
  }

  static mapOrderBookToTokens(orderBooks: OrderBookResponse[], tokens: Token[]) {
    return orderBooks.map(symbol => {
      tokens.map(token => {
        if(symbol.symbol === token.symbol) {
          token.bid = symbol.bid;
          token.ask = symbol.ask;
        }
      });
    });
  }

  static mapTokensToSymbols(tokens: Token[], splitter: string, toLowerCase: boolean): string[] {
    const symbols: string[] = [];

    tokens.map(token => {
      let symbol = SymbolUtils.getFullSymbol(token, splitter);

      if(toLowerCase) {
        symbol = symbol.toLowerCase();
      }

      symbols.push(symbol);
    });

    return symbols;
  }
}