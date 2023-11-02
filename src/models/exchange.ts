import ExchangeApi from "../api/exchange_api";
import ExchangeMapper from "../mapper/exchange_mapper";
import TimerUtils from "../utils/timer_utils";

export interface Token {
  symbol: string;
  base: string;
  quote: string;
  bid: number;
  ask: number;
}

export default class Exchange {
  private api: ExchangeApi = new ExchangeApi();
  tokens: Token[] = [];
  name: string = "";
  link: string = "";
  linkSplitter: string = "";
  blackList: {symbol: string, time: number}[] = [];
  private splitter: string = "";
  private toLowerCase: boolean = false;

  constructor(exchange: string, splitter: string, link: string, linkSplitter: string, toLowerCase: boolean = false) {
    this.name = exchange;
    this.splitter = splitter;
    this.link = link;
    this.linkSplitter = linkSplitter;
    this.toLowerCase = toLowerCase;
  }

  public addToBlackList(symbol: string) {
    this.blackList.push({symbol: symbol, time: new Date().getMilliseconds()});
  }

  public getTokenBySymbolFromBlackList(symbol: string): {symbol: string, time: number}[] {
    return this.blackList.filter((item) => item.symbol === symbol);
  }

  public hasTokenBySymbolFromBlackList(symbol: string): boolean {
    let hasToken = false;

    this.blackList.map((item) => {
      if (item.symbol === symbol) {
        hasToken = true;
      }
    });

    return hasToken;
  }


  public isTokenReady(symbol: string) {
    const item = this.getTokenBySymbolFromBlackList(symbol)[0];

    if (new Date().getMilliseconds() - item.time > 3600000) {
      return true;
    }

    return false;
  }

  public async getBaseQuotes() {
    const { data: baseQuotes } = await this.api.getTradingPairs(this.name);
    ExchangeMapper.mapQuoteBaseToTokens(baseQuotes, this.tokens);
  }

  public async getOrderBooks(tokens: Token[]) {

    const { data: orderBooks } = await this.api.getOrderBooks(ExchangeMapper.mapTokensToSymbols(tokens, this.splitter, this.toLowerCase), this.name);
    if(orderBooks === "running") {
      await TimerUtils.sleep(2000);
      await this.getOrderBooks(tokens);
    }
    if(typeof orderBooks !== "string" )
    ExchangeMapper.mapOrderBookToTokens(orderBooks, tokens);  
  }
}