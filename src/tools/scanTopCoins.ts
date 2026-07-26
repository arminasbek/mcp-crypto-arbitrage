import { z } from "zod";
import { getTopMarkets } from "@/endpoints/markets.js";
import { getTickers, widestSpread } from "@/endpoints/tickers.js";
import type { Tool } from "@/tools/types.js";

export const scanTopCoinsTool: Tool = {
  name: "scan_top_coins",
  description:
    "Scan the top N coins by market cap for cross-exchange arbitrage spreads above a threshold. Uses N+1 API calls — mind the CoinGecko rate limit.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .default(5)
      .describe("How many top coins to scan"),
    min_spread_pct: z
      .number()
      .min(0)
      .default(0.5)
      .describe("Minimum spread percentage to report"),
  },
  async handler(config, args) {
    const limit = args.limit as number;
    const minSpreadPct = args.min_spread_pct as number;

    const markets = await getTopMarkets(config, limit);
    const results: string[] = [];

    for (const market of markets) {
      const { tickers } = await getTickers(config, market.id);
      const spread = widestSpread(tickers);
      if (spread && spread.spreadPct >= minSpreadPct) {
        results.push(
          `${market.symbol.toUpperCase()}: ${spread.spreadPct.toFixed(3)}% (${spread.lowest.market.name} -> ${spread.highest.market.name})`,
        );
      }
    }

    const text =
      results.length > 0
        ? results.join("\n")
        : `No spreads >= ${minSpreadPct}% found across top ${limit} coins.`;

    return { content: [{ type: "text", text }] };
  },
};
