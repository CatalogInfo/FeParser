export default class TimerUtils {
  static async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}