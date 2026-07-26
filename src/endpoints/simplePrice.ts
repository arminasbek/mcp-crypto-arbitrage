import { request } from "@/apiClient.js";
import type { Config } from "@/config.js";

export interface SimplePriceResult {
  [coinId: string]: { usd: number } | undefined;
}

export async function getSimplePrice(
  config: Config,
  coinIds: string[],
): Promise<SimplePriceResult> {
  const params = new URLSearchParams({
    ids: coinIds.join(","),
    vs_currencies: "usd",
  });
  return request<SimplePriceResult>(config, "simple/price", params);
}
