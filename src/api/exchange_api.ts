import api_factory from "./api_factory";
import BaseApiResponse from "./response/base_api_response";

export default class ExhangeApi {

  baseUrl = "http://localhost:8080";

  async getOrderBooks(exchange: string, symbols: string[]): Promise<BaseApiResponse<string>> {
    return await api_factory.getInstance().post(`${this.baseUrl}/${exchange}/order_books`, symbols);
  }

  async getTradingPairs(exchange: string): Promise<BaseApiResponse<string>> {
    return await api_factory.getInstance().get(`${this.baseUrl}/${exchange}/trading_pairs`);
  }
}