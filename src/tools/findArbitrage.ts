import { z } from "zod";
import { getTickers, widestSpread } from "@/endpoints/tickers.js";
import type { Tool } from "@/tools/types.js";

export const findArbitrageTool: Tool = {
  name: "find_arbitrage",
  description:
    "Find the widest cross-exchange USD/USDT price spread for one coin, above a minimum percentage.",
  inputSchema: {
    coin: z.string().describe('CoinGecko coin ID, e.g. "bitcoin"'),
    min_spread_pct: z
      .number()
      .min(0)
      .default(0.5)
      .describe("Minimum spread percentage to report"),
  },
  async handler(config, args) {
    const coin = args.coin as string;
    const minSpreadPct = args.min_spread_pct as number;

    const { tickers } = await getTickers(config, coin);
    const spread = widestSpread(tickers);

    if (!spread) {
      return {
        content: [
          { type: "text", text: `Not enough USD/USDT markets for ${coin} to compare.` },
        ],
      };
    }

    const { lowest, highest, spreadPct } = spread;
    if (spreadPct < minSpreadPct) {
      return {
        content: [
          {
            type: "text",
            text: `No arbitrage above ${minSpreadPct}% for ${coin}. Widest spread: ${spreadPct.toFixed(3)}% (${lowest.market.name} $${lowest.last} -> ${highest.market.name} $${highest.last}).`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `${coin}: ${spreadPct.toFixed(3)}% spread — buy on ${lowest.market.name} ($${lowest.last}), sell on ${highest.market.name} ($${highest.last}).`,
        },
      ],
    };
  },
};
