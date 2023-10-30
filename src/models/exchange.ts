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
  private splitter: string = "";
  private toLowerCase: boolean = false;

  constructor(exchange: string, splitter: string, toLowerCase: boolean, link: string) {
    this.name = exchange;
    this.splitter = splitter;
    this.toLowerCase = toLowerCase;
    this.link = link;
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