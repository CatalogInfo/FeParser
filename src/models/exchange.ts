import ExchangeApi from "../api/exchange_api";
import ExchangeMapper from "../mapper/exchange_mapper";

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
  private exchange: string = "";
  private splitter: string = "";
  private toLowerCase: boolean = false;

  constructor(exchange: string, splitter: string, toLowerCase: boolean = false) {
    this.exchange = exchange;
    this.splitter = splitter;
    this.toLowerCase = toLowerCase;
  }

  public async getBaseQuotes() {
    const { data: baseQuotes } = await this.api.getTradingPairs(this.exchange);
    ExchangeMapper.mapQuoteBaseToTokens(baseQuotes, this.tokens);


  }

  public async getOrderBooks(tokens: Token[]) {
    const { data: orderBooks } = await this.api.getOrderBooks(ExchangeMapper.mapTokensToSymbols(tokens, this.splitter, this.toLowerCase), this.exchange);
    ExchangeMapper.mapOrderBookToTokens(orderBooks, tokens);  
  }

}