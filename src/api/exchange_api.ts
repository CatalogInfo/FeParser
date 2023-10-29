import api_factory from "./api_factory";
import BaseApiResponse from "../response/base_api_response";
import OrderBooks from "../response/order_book_response";
import TradingPairs from "../response/trading_pair_response";

export default class ExhangeApi {

  baseUrl = "http://localhost:8080";

  async getOrderBooks(exchange: string, symbols: string[]): Promise<BaseApiResponse<OrderBooks>> {
    return await api_factory.getInstance().post(`${this.baseUrl}/${exchange}/order_books`, symbols);
  }

  async getTradingPairs(exchange: string): Promise<BaseApiResponse<TradingPairs>> {
    return await api_factory.getInstance().get(`${this.baseUrl}/${exchange}/trading_pairs`);
  }
}