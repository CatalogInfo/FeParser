import axios, { type AxiosResponse } from "axios";
import applyCaseMiddleware from "axios-case-converter";
import type BaseApi from "./base_api";
import type BaseApiResponse from "./response/base_api_response";


function convertAxiosResponse<T>(response: AxiosResponse<T>): BaseApiResponse<T> {
  return {
    data: response.data,
    status: response.status,
  };
}

export default class AxiosApi implements BaseApi {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      headers: {
        // 'Content-Type': 'application/json', // Example: Setting the content type
        // 'Accept': '*/*',
        // 'Origin': 'https://localhost:3000',
        // 'Refer': 'https://localhost:3000/',
      }
    });

    applyCaseMiddleware(this.axiosInstance);
  }

  async get<T>(url: string): Promise<BaseApiResponse<T>> {
    const response = await this.axiosInstance.get(url);
    return convertAxiosResponse(response);
  }

  async post<T, D>(url: string, data: D): Promise<BaseApiResponse<T>> {
    const response = await this.axiosInstance.post(url, data);
    return convertAxiosResponse(response);
  }

  async put<T, D>(url: string, data: D): Promise<BaseApiResponse<T>> {
    const response = await this.axiosInstance.put(url, data);
    return convertAxiosResponse(response);
  }

  async delete<T>(url: string): Promise<BaseApiResponse<T>> {
    const response = await this.axiosInstance.delete(url);
    return convertAxiosResponse(response);
  }
}
