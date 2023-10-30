import BaseApiResponse from "../response/base_api_response";
import api_factory from "./api_factory";

export default class TelegramApi {
  static baseUrl = "http://localhost:8080";

  static async sendMessage(message: string): Promise<BaseApiResponse<string>> {
    return await api_factory.getInstance().post(`${this.baseUrl}/send_message`, message);
  }
}