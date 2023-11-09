import Exchange, { Token } from "../models/exchange";

export default class BlackListUtils {

  public static tokenInBlackList(
    token1: Token,
    token2: Token,
    exchange1: Exchange,
    exchange2: Exchange
  ) {
    return (
      this.hasTokenBySymbolFromBlackList(
        token1.symbol,
        exchange1.blackList
      ) &&
      this.hasTokenBySymbolFromBlackList(
        token2.symbol,
        exchange2.blackList
      ) &&
      !this.isTokenReady(token1.symbol, token2.symbol, exchange1, exchange2) 
    );
  }

  public static addToBlackList(symbol: string, blackList: {symbol: string, time: number}[]) {
    if (this.hasTokenBySymbolFromBlackList(symbol, blackList)) {
      return;
    }

    blackList.push({symbol: symbol, time: Date.now()});
  }

  private static getTokenBySymbolFromBlackList(symbol: string, blackList: {symbol: string, time: number}[]): {symbol: string, time: number}[] {
    return blackList.filter(item => item.symbol === symbol);
  }

  private static updateTime(symbol: string, blackList: {symbol: string, time: number}[]) {
    return blackList.filter(item => {
      if(item.symbol === symbol) {
        item.time = Date.now();
      }
  });

  }

  private static hasTokenBySymbolFromBlackList(symbol: string, blackList: {symbol: string, time: number}[]): boolean {
    return blackList.some(item => item.symbol.toUpperCase() === symbol);
  }

  public static isTokenReady(symbol1: string, symbol2: string, exchange1: Exchange, exchange2: Exchange) {
    const item1 = this.getTokenBySymbolFromBlackList(symbol1, exchange1.blackList)[0];
    const item2 = this.getTokenBySymbolFromBlackList(symbol2, exchange2.blackList)[0];

    console.log(exchange1.blackList)
    console.log(exchange2.blackList)

    if (Date.now() - item1.time > 3600000 && Date.now() - item2.time > 3600000) {
      this.updateTime(symbol1, exchange1.blackList);
      this.updateTime(symbol2, exchange2.blackList);

      return true;
    }

    return false;
  }
}