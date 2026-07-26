import { z } from "zod";
import { getSimplePrice } from "@/endpoints/simplePrice.js";
import type { Tool } from "@/tools/types.js";

export const getCoinPricesTool: Tool = {
  name: "get_coin_prices",
  description:
    "Get current USD prices for one or more coins by CoinGecko ID (e.g. bitcoin, ethereum).",
  inputSchema: {
    coins: z
      .array(z.string())
      .min(1)
      .describe('CoinGecko coin IDs, e.g. ["bitcoin", "ethereum"]'),
  },
  async handler(config, args) {
    const coins = args.coins as string[];
    const prices = await getSimplePrice(config, coins);

    const lines = coins.map((id) => {
      const usd = prices[id]?.usd;
      return usd !== undefined ? `${id}: $${usd}` : `${id}: not found`;
    });

    return { content: [{ type: "text", text: lines.join("\n") }] };
  },
};
