import type BaseApi from "./base_api";
import AxiosApi from "./axios_api";

class ApiFactory {
  getInstance(): BaseApi {
    return new AxiosApi();
  }
}

export default new ApiFactory();
