import Exchange, { Token } from "../models/exchange";

export default class BanListUtils {
  public static tokenInBanList(
    token: Token,
    exchange: Exchange,
  ) {
    return (
      this.hasTokenBySymbolFromBanList(
        token.base + token.quote,
        exchange.banList
      )
    );
  }

  private static hasTokenBySymbolFromBanList(symbol: string, banList: string[]): boolean {
    return banList.some(item => item.toUpperCase() === symbol.toUpperCase());
  }
}