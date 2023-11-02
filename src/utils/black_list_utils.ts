import Exchange, { Token } from "../models/exchange";

export default class BlackListUtils {

  public static tokenInBlackList(
    token1: Token,
    token2: Token,
    exchange1: Exchange,
    exchange2: Exchange
  ) {
    return (
      BlackListUtils.hasTokenBySymbolFromBlackList(
        token1.symbol,
        exchange1.blackList
      ) &&
      BlackListUtils.hasTokenBySymbolFromBlackList(
        token2.symbol,
        exchange2.blackList
      ) &&
      !BlackListUtils.isTokenReady(token1.symbol, exchange1.blackList) &&
      !BlackListUtils.isTokenReady(token2.symbol, exchange2.blackList)
    );
  }

  public static addToBlackList(symbol: string, blackList: {symbol: string, time: number}[]) {
    blackList.push({symbol: symbol, time: Date.now()});
  }

  private static getTokenBySymbolFromBlackList(symbol: string, blackList: {symbol: string, time: number}[]): {symbol: string, time: number}[] {
    return blackList.filter((item) => item.symbol === symbol);
  }

  private static hasTokenBySymbolFromBlackList(symbol: string, blackList: {symbol: string, time: number}[]): boolean {
    return blackList.some(item => item.symbol.toUpperCase() === symbol);

  }

  public static isTokenReady(symbol: string, blackList: {symbol: string, time: number}[]) {
    const item = this.getTokenBySymbolFromBlackList(symbol, blackList)[0];

    if (Date.now() - item.time > 3600000) {
      return true;
    }

    return false;
  }
}