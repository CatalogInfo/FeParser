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
  banList = [];
  private splitter: string = "";
  private toLowerCase: boolean = false;

  clearBlackList() {
    this.blackList = [];
    console.log(this.blackList);
  }

  constructor(exchange: string, splitter: string, link: string, linkSplitter: string, toLowerCase: boolean = false) {
    this.name = exchange;
    this.splitter = splitter;
    this.link = link;
    this.linkSplitter = linkSplitter;
    this.toLowerCase = toLowerCase;
  }

  public async getBaseQuotes() {
    const { data: baseQuotes } = await this.api.getTradingPairs(this.name);
    ExchangeMapper.mapQuoteBaseToTokens(baseQuotes, this.tokens, this);
  }

  public async getBanList() {
    const { data: banListResponse } = await this.api.getBanList(this.name);
    ExchangeMapper.mapBanListToArray(this.banList, banListResponse);
  }

  public async getOrderBooks(tokens: Token[]) {
    const { data: orderBooks } = await this.api.getOrderBooks(ExchangeMapper.mapTokensToSymbols(tokens, this.splitter, this.toLowerCase), this.name);

    if(orderBooks === "running") {
      await TimerUtils.sleep(2000);
      await this.getOrderBooks(tokens);
    }

    if(typeof orderBooks !== "string")
      ExchangeMapper.mapOrderBookToTokens(orderBooks, tokens);  
  }
}