export default interface BaseApiResponse<T> {
  data: T;
  status: number;
}
