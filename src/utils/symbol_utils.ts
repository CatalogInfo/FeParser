import { Token } from "../models/exchange";

export default class SymbolUtils {
  static getFullSymbol(symbol: Token, splitter: string) {
    return symbol.base + splitter + symbol.quote;
  }
}