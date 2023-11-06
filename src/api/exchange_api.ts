import api_factory from "./api_factory";
import BaseApiResponse from "../response/base_api_response";
import OrderBook from "../response/order_book_response";
import TradingPair from "../response/trading_pair_response";
import BanListResponse from "../response/ban_list_response";

export default class ExchangeApi {

  baseUrl = "http://localhost:8080";

  async getOrderBooks(symbols: string[], exchange: string): Promise<BaseApiResponse<OrderBook[] | string>> {
    return await api_factory.getInstance().post(`${this.baseUrl}/${exchange}/order_books`, symbols);
  }

  async getTradingPairs(exchange: string): Promise<BaseApiResponse<TradingPair[]>> {
    return await api_factory.getInstance().get(`${this.baseUrl}/${exchange}/trading_pairs`);
  }

  async getBanList(exchange: string): Promise<BaseApiResponse<BanListResponse[]>> {
    return await api_factory.getInstance().get(`${this.baseUrl}/banList?exchange=${exchange}`);
  }
}