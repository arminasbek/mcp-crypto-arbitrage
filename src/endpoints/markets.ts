import { request } from "@/apiClient.js";
import type { Config } from "@/config.js";

export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
}

export async function getTopMarkets(
  config: Config,
  limit: number,
): Promise<MarketCoin[]> {
  const params = new URLSearchParams({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: String(limit),
    page: "1",
  });
  return request<MarketCoin[]>(config, "coins/markets", params);
}
