import TelegramApi from "./api/telegram_api";
import Exchange, { Token } from "./models/exchange";
import Splitter from "./splitter/splitter";
import SpreadCalculator from "./spread_calculator";
import BlackListUtils from "./utils/black_list_utils";
import MessageUtils from "./utils/message_utils";
import TimerUtils from "./utils/timer_utils";

export default class SpreadFinder {

  static MIN_SPREAD = 2;
  static MAX_SPREAD = 20;

  static async findSpreads() {
    await Splitter.split();

    await this.parseTokensAndSendSpread();
  }

  private static async parseTokensAndSendSpread() {
    const exchangesNames: string[] = [];
    const exchangePairs = this.parseExchangesPairs(exchangesNames);

    for (const pair of exchangePairs) {
      for (const token of pair.exchange1.tokens) {
        for (const token1 of pair.exchange2.tokens) {
          if (token.base.toUpperCase() === token1.base.toUpperCase()) {
            await this.defineSpread(token, token1, pair.exchange1, pair.exchange2);
          }
        }
      }
    }
  }

  private static async defineSpread(
    token1: Token,
    token2: Token,
    exchange1: Exchange,
    exchange2: Exchange
  ) {
    const spread = SpreadCalculator.calculateSpread(token1, token2);
      if(spread > this.MIN_SPREAD && spread < this.MAX_SPREAD) {
        if (BlackListUtils.tokenInBlackList(token1, token2, exchange1, exchange2)) {
          return;
        } 
        BlackListUtils.addToBlackList(token1.symbol, exchange1.blackList);
        BlackListUtils.addToBlackList(token2.symbol, exchange2.blackList);

        let formattedMessage = MessageUtils.getFormattedMessage(
          token1,
          token2,
          exchange1,
          exchange2,
          spread
        );
        if (token1.bid > token2.ask) {
          formattedMessage = MessageUtils.getFormattedMessage(
            token2,
            token1,
            exchange2,
            exchange1,
            spread
          );
        }

        await TelegramApi.sendMessage(formattedMessage);
        TimerUtils.sleep(1000);
    }
  }

  private static parseExchangesPairs(blackExchangesList: string[]) {
    const exchangesList = [];

    for (const exchange1 of Splitter.exchanges) {
      blackExchangesList.push(exchange1.name);
      for (const exchange2 of Splitter.exchanges) {
        if (blackExchangesList.includes(exchange2.name)) {
          continue;
        }
        exchangesList.push({ exchange1, exchange2 });
      }
    }

    return exchangesList;
  }
}
