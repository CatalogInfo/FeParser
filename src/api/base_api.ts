import type BaseApiResponse from "./response/base_api_response";

export default interface BaseApi {
  get<T>(url: string): Promise<BaseApiResponse<T>>;
  post<T, D>(url: string, data: D): Promise<BaseApiResponse<T>>;
  put<T, D>(url: string, data: D): Promise<BaseApiResponse<T>>;
  delete<T>(url: string): Promise<BaseApiResponse<T>>;
}
