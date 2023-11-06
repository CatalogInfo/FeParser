import Exchange, { Token } from "../models/exchange";

export default class MessageUtils {
  static getFormattedMessage(
    token1: Token,
    token2: Token,
    exchange1: Exchange,
    exchange2: Exchange,
    spread: number
  ) {
    return `
        ${token1.symbol}
        <a href="${
          exchange1.link + token1.base + exchange1.linkSplitter + token1.quote
        }"> ${exchange1.name} </a>: buy ${token1.ask}
        <a href="${
          exchange2.link + token2.base + exchange2.linkSplitter + token2.quote
        }"> ${exchange2.name} </a>: sell ${token2.bid}
        spread: ${spread.toFixed(2)}%25
      `;
  }
}