import Exchange, { Token } from "../models/exchange";

export default class BlackListUtils {

  public static tokenInBlackList(
    token1: Token,
    token2: Token,
    blackList1: {symbol: string, time: number}[],
    blackList2: {symbol: string, time: number}[]
  ) {
    return (
      this.hasTokenBySymbolFromBlackList(
        token1.symbol,
        blackList1
      ) &&
      this.hasTokenBySymbolFromBlackList(
        token2.symbol,
        blackList2
      ) &&
      !this.isTokenReady(token1.symbol, blackList1) &&
      !this.isTokenReady(token2.symbol,blackList2)
    );
  }

  public static addToBlackList(symbol: string, blackList: {symbol: string, time: number}[]) {
    blackList.push({symbol: symbol, time: Date.now()});
  }

  private static getTokenBySymbolFromBlackList(symbol: string, blackList: {symbol: string, time: number}[]): {symbol: string, time: number}[] {
    return blackList.filter(item => item.symbol === symbol);
  }

  private static hasTokenBySymbolFromBlackList(symbol: string, blackList: {symbol: string, time: number}[]): boolean {
    return blackList.some(item => item.symbol.toUpperCase() === symbol);
  }

  public static isTokenReady(symbol: string, blackList: {symbol: string, time: number}[]) {
    const item = this.getTokenBySymbolFromBlackList(symbol, blackList)[0];

    console.log(blackList)
    if (Date.now() - item.time > 120000) {
      blackList.push({symbol: "workes", time: Date.now()});
      blackList = [];
      return true;
    }

    return false;
  }

  private static deleteTokenFromBlackList(symbol: string, blackList: {symbol: string, time: number}[]) {
    return blackList.filter((item, index) => {
      if(item.symbol.toUpperCase() === symbol) {
        blackList.splice(index, 1);
      }
    });
  }
}